import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useSelector } from 'react-redux';
import { CustomerInfo } from 'react-native-purchases';
import { purchasesService } from '../utils/purchasesService';
import Superwall, {
  SubscriptionStatus,
} from '@superwall/react-native-superwall';
import { RCPurchaseController } from '../utils/RCPurchaseController';
import { SUPERWALL_CONFIG, REVENUECAT_CONFIG } from '../config/purchasesConfig';

interface SubscriptionContextType {
  isPremium: boolean;
  isInitializing: boolean;
  isSuperwallReady: boolean;
  customerInfo: CustomerInfo | null;
  packages: {
    monthly: any;
    yearly: any;
  } | null;
  purchasePlan: (plan: 'monthly' | 'yearly') => Promise<boolean>;
  presentPaywall: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<{
    monthly: any;
    yearly: any;
  } | null>(null);

  // Retrieve user auth and ID from Redux
  const auth = useSelector((state: any) => state.userData?.auth);
  const userId = useSelector((state: any) => state.userData?.user?._id);

  const [isSuperwallReady, setIsSuperwallReady] = useState<boolean>(false);

  // Initialize SDK
  useEffect(() => {
    let unsubscribeFn: (() => void) | undefined;
    let superwallConfigured = false;

    // Helper: Only call Superwall methods after configure has completed
    const syncSuperwallStatus = (hasPremium: boolean) => {
      if (!superwallConfigured) return;
      try {
        if (hasPremium) {
          Superwall.shared.setSubscriptionStatus(
            SubscriptionStatus.Active([REVENUECAT_CONFIG.entitlementId]),
          );
        } else {
          Superwall.shared.setSubscriptionStatus(SubscriptionStatus.Inactive());
        }
      } catch (error) {
        console.error('[Superwall] Error syncing subscription status:', error);
      }
    };

    const setupPurchases = async () => {
      await purchasesService.initialize();

      // Set up listener for customer info updates (RevenueCat - works independently)
      const unsubscribe = purchasesService.addCustomerInfoListener(info => {
        setCustomerInfo(info);
        const hasPremium = purchasesService.hasPremiumEntitlement(info);
        setIsPremium(hasPremium);
        // Only sync with Superwall if it's already configured
        syncSuperwallStatus(hasPremium);
      });
      unsubscribeFn = unsubscribe;

      // Fetch initial customer info and offerings (RevenueCat - independent of Superwall)
      let initialPremiumStatus = false;
      try {
        initialPremiumStatus = await purchasesService.checkPremiumStatus();
        setIsPremium(initialPremiumStatus);

        const offering = await purchasesService.getOfferings();
        if (offering) {
          setPackages({
            monthly: offering.monthly || null,
            yearly: offering.annual || null,
          });
        }
      } catch (error) {
        console.error(
          '[RevenueCat] Error fetching initial status/offerings:',
          error,
        );
      } finally {
        setIsInitializing(false);
      }

      // Configure Superwall SDK AFTER RevenueCat is done (non-blocking)
      const apiKey = SUPERWALL_CONFIG.apiKey;
      if (apiKey && !apiKey.includes('placeholder')) {
        console.log(
          '[Superwall] Waiting for AppState to be active before configuring SDK...',
        );

        // Wait for AppState to be active to ensure Android has a valid currentActivity
        if (AppState.currentState !== 'active') {
          await new Promise<void>(resolve => {
            const subscription = AppState.addEventListener(
              'change',
              nextAppState => {
                if (nextAppState === 'active') {
                  subscription.remove();
                  resolve();
                }
              },
            );
          });
        }

        console.log('[Superwall] Configuring SDK in background...');
        try {
          // Do NOT await this promise on Android, as the native SDK sometimes never resolves it
          Superwall.configure({
            apiKey,
            purchaseController: new RCPurchaseController(),
          }).catch(err =>
            console.error('[Superwall] Background configure error:', err),
          );

          console.log('[Superwall] SDK configuration triggered.');
          superwallConfigured = true;

          // Now sync the subscription status we already fetched
          syncSuperwallStatus(initialPremiumStatus);
          setIsSuperwallReady(true);
        } catch (error) {
          console.error('[Superwall] Failed to trigger SDK config:', error);
          setIsSuperwallReady(true);
        }
      } else {
        console.warn(
          '[Superwall] API Key is missing or placeholder. Skipping Superwall configuration.',
        );
      }
    };

    setupPurchases();

    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, []);

  // Sync user identification on login/logout
  useEffect(() => {
    const syncUser = async () => {
      if (auth && userId) {
        console.log('[RevenueCat] Identifying user:', userId);
        const info = await purchasesService.login(userId);
        if (info) {
          setCustomerInfo(info);
          const hasPremium = purchasesService.hasPremiumEntitlement(info);
          setIsPremium(hasPremium);

          // Only call Superwall if it's ready (avoid deadlock on awaitConfig)
          if (isSuperwallReady) {
            try {
              await Superwall.shared.identify({ userId });
              if (hasPremium) {
                Superwall.shared.setSubscriptionStatus(
                  SubscriptionStatus.Active([REVENUECAT_CONFIG.entitlementId]),
                );
              } else {
                Superwall.shared.setSubscriptionStatus(
                  SubscriptionStatus.Inactive(),
                );
              }
            } catch (error) {
              console.error('[Superwall] Error identifying user:', error);
            }
          }
        }
      } else if (!auth) {
        console.log('[RevenueCat] Resetting user on logout');
        const info = await purchasesService.logout();

        // Only reset Superwall if it's ready
        if (isSuperwallReady) {
          try {
            await Superwall.shared.reset();
            Superwall.shared.setSubscriptionStatus(
              SubscriptionStatus.Inactive(),
            );
          } catch (error) {
            console.error('[Superwall] Error resetting user:', error);
          }
        }

        if (info) {
          setCustomerInfo(info);
          setIsPremium(purchasesService.hasPremiumEntitlement(info));
        } else {
          setCustomerInfo(null);
          setIsPremium(false);
        }
      }
    };

    syncUser();
  }, [auth, userId, isSuperwallReady]);

  const purchasePlan = async (plan: 'monthly' | 'yearly'): Promise<boolean> => {
    try {
      const result = await purchasesService.purchasePlan(plan);
      if (result) {
        setIsPremium(true);
      }
      return result;
    } catch (error) {
      console.error('[RevenueCat] Error during direct plan purchase:', error);
      return false;
    }
  };

  const presentPaywall = async (): Promise<boolean> => {
    try {
      const result = await purchasesService.presentPaywall();
      if (result) {
        setIsPremium(true);
      }
      return result;
    } catch (error) {
      console.error('[RevenueCat] Error during paywall purchase:', error);
      return false;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      const info = await purchasesService.restorePurchases();
      if (info) {
        setCustomerInfo(info);
        const isUserPremium = purchasesService.hasPremiumEntitlement(info);
        setIsPremium(isUserPremium);
        return isUserPremium;
      }
      return false;
    } catch (error) {
      console.error('[RevenueCat] Error restoring purchases:', error);
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        isInitializing,
        isSuperwallReady,
        customerInfo,
        packages,
        purchasePlan,
        presentPaywall,
        restorePurchases,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider',
    );
  }
  return context;
};
