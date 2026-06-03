import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesOffering } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { REVENUECAT_CONFIG } from '../config/purchasesConfig';

class PurchasesService {
  private isConfigured: boolean = false;

  /**
   * Initializes the RevenueCat SDK with the platform-specific API key.
   */
  public async initialize(): Promise<void> {
    if (this.isConfigured) {
      console.log('[RevenueCat] SDK is already configured.');
      return;
    }

    const apiKey = REVENUECAT_CONFIG.apiKey;
    if (!apiKey || apiKey.includes('placeholder')) {
      console.warn(
        '[RevenueCat] API Key is missing or placeholder. Please update src/config/purchasesConfig.ts with your real API keys.'
      );
      return;
    }

    try {
      // Configure RevenueCat
      Purchases.configure({ apiKey });
      
      // Enable debug logs in development mode
      if (__DEV__) {
        await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      }

      this.isConfigured = true;
      console.log('[RevenueCat] SDK initialized successfully.');
    } catch (error) {
      console.error('[RevenueCat] Failed to initialize SDK:', error);
    }
  }

  /**
   * Checks if the user has the active premium entitlement.
   */
  public async checkPremiumStatus(): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return this.hasPremiumEntitlement(customerInfo);
    } catch (error) {
      console.error('[RevenueCat] Error checking premium status:', error);
      return false;
    }
  }

  /**
   * Helper to verify if the entitlement is active in CustomerInfo.
   */
  public hasPremiumEntitlement(customerInfo: CustomerInfo): boolean {
    const entitlementId = REVENUECAT_CONFIG.entitlementId;
    const premiumEntitlement = customerInfo.entitlements.active[entitlementId];
    return !!premiumEntitlement;
  }

  /**
   * Fetches the offerings configured in RevenueCat dashboard.
   */
  public async getOfferings(): Promise<PurchasesOffering | null> {
    if (!this.isConfigured) {
      console.warn('[RevenueCat] SDK not configured. Cannot fetch offerings.');
      return null;
    }

    try {
      const offerings = await Purchases.getOfferings();
      const specificOffering = REVENUECAT_CONFIG.offeringId;

      if (specificOffering && offerings.all[specificOffering]) {
        return offerings.all[specificOffering];
      }
      
      return offerings.current;
    } catch (error) {
      console.error('[RevenueCat] Error fetching offerings:', error);
      return null;
    }
  }

  /**
   * Purchases a specific plan ('monthly' or 'yearly') directly.
   */
  public async purchasePlan(plan: 'monthly' | 'yearly'): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('[RevenueCat] SDK not configured. Cannot purchase plan.');
      return false;
    }

    try {
      const offerings = await Purchases.getOfferings();
      const specificOfferingId = REVENUECAT_CONFIG.offeringId;
      const offering = specificOfferingId && offerings.all[specificOfferingId]
        ? offerings.all[specificOfferingId]
        : offerings.current;

      if (!offering) {
        console.warn('[RevenueCat] No active offering found.');
        return false;
      }

      const packageToBuy = plan === 'yearly' ? offering.annual : offering.monthly;

      if (!packageToBuy) {
        console.warn(`[RevenueCat] Package not found for plan: ${plan}`);
        return false;
      }

      const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
      return this.hasPremiumEntitlement(customerInfo);
    } catch (error: any) {
      if (error?.userCancelled) {
        console.log('[RevenueCat] User cancelled purchase flow.');
      } else {
        console.error('[RevenueCat] Purchase failed:', error);
      }
      return false;
    }
  }

  /**
   * Presents the RevenueCat Paywall.
   * If a specific offering is required, it fetches it first and presents that specific paywall.
   */
  public async presentPaywall(): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('[RevenueCat] SDK not configured. Cannot present paywall.');
      return false;
    }

    try {
      let result: string;
      const offering = await this.getOfferings();
      
      if (offering) {
        result = await RevenueCatUI.presentPaywall({ offering });
      } else {
        result = await RevenueCatUI.presentPaywall();
      }

      console.log('[RevenueCat] Paywall presentation result:', result);

      if (result === PAYWALL_RESULT.PURCHASED) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('[RevenueCat] Error presenting paywall:', error);
      return false;
    }
  }

  /**
   * Restores user purchases.
   */
  public async restorePurchases(): Promise<CustomerInfo | null> {
    if (!this.isConfigured) {
      console.warn('[RevenueCat] SDK not configured. Cannot restore purchases.');
      return null;
    }

    try {
      const customerInfo = await Purchases.restorePurchases();
      console.log('[RevenueCat] Purchases restored successfully.');
      return customerInfo;
    } catch (error) {
      console.error('[RevenueCat] Error restoring purchases:', error);
      throw error;
    }
  }

  /**
   * Registers a listener to monitor customer info changes (e.g. renewal, expiration, purchase).
   */
  public addCustomerInfoListener(listener: (customerInfo: CustomerInfo) => void): () => void {
    if (!this.isConfigured) {
      return () => {};
    }

    const subscription = Purchases.addCustomerInfoUpdateListener(listener);
    
    // Return unsubscribe function
    return () => {
      // In newer react-native-purchases versions, Purchases.removeCustomerInfoUpdateListener exists, or the listener returns a subscription object that has a remove() method.
      if (subscription && typeof subscription === 'function') {
        (subscription as any)();
      } else if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }

  /**
   * Identifies a user with their unique app userId (for logged in users).
   */
  public async login(userId: string): Promise<CustomerInfo | null> {
    if (!this.isConfigured) return null;
    try {
      const loginResult = await Purchases.logIn(userId);
      return loginResult.customerInfo;
    } catch (error) {
      console.error('[RevenueCat] Error identifying user:', error);
      return null;
    }
  }

  /**
   * Resets the user in RevenueCat SDK (on user logout).
   */
  public async logout(): Promise<CustomerInfo | null> {
    if (!this.isConfigured) return null;
    try {
      return await Purchases.logOut();
    } catch (error) {
      console.error('[RevenueCat] Error resetting user:', error);
      return null;
    }
  }
}

export const purchasesService = new PurchasesService();
