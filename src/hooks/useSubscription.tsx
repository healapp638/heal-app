import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CustomerInfo } from 'react-native-purchases';
import { purchasesService } from '../utils/purchasesService';

interface SubscriptionContextType {
  isPremium: boolean;
  isInitializing: boolean;
  customerInfo: CustomerInfo | null;
  packages: {
    monthly: any;
    yearly: any;
  } | null;
  purchasePlan: (plan: 'monthly' | 'yearly') => Promise<boolean>;
  presentPaywall: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<{ monthly: any; yearly: any } | null>(null);

  // Retrieve user auth and ID from Redux
  const auth = useSelector((state: any) => state.userData?.auth);
  const userId = useSelector((state: any) => state.userData?.user?._id);

  // Initialize SDK
  useEffect(() => {
    let unsubscribeFn: (() => void) | undefined;

    const setupPurchases = async () => {
      await purchasesService.initialize();

      // Set up listener for customer info updates
      const unsubscribe = purchasesService.addCustomerInfoListener((info) => {
        setCustomerInfo(info);
        setIsPremium(purchasesService.hasPremiumEntitlement(info));
      });
      unsubscribeFn = unsubscribe;

      // Fetch initial customer info and offerings
      try {
        const premiumActive = await purchasesService.checkPremiumStatus();
        setIsPremium(premiumActive);

        const offering = await purchasesService.getOfferings();
        if (offering) {
          setPackages({
            monthly: offering.monthly || null,
            yearly: offering.annual || null,
          });
        }
      } catch (error) {
        console.error('[RevenueCat] Error fetching initial status/offerings:', error);
      } finally {
        setIsInitializing(false);
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
          setIsPremium(purchasesService.hasPremiumEntitlement(info));
        }
      } else if (!auth) {
        console.log('[RevenueCat] Resetting user on logout');
        const info = await purchasesService.logout();
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
  }, [auth, userId]);

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
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
