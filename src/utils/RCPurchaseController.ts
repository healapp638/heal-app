import {
  PurchaseController,
  PurchaseResult,
  PurchaseResultCancelled,
  PurchaseResultFailed,
  PurchaseResultPurchased,
  RestorationResult,
} from '@superwall/react-native-superwall';
import Purchases from 'react-native-purchases';
import { REVENUECAT_CONFIG } from '../config/purchasesConfig';

export class RCPurchaseController extends PurchaseController {
  async purchaseFromAppStore(productId: string): Promise<PurchaseResult> {
    return this.purchaseProduct(productId);
  }

  async purchaseFromGooglePlay(
    productId: string,
    basePlanId?: string,
    offerId?: string
  ): Promise<PurchaseResult> {
    return this.purchaseProduct(productId);
  }

  private async purchaseProduct(productId: string): Promise<PurchaseResult> {
    try {
      console.log(`[Superwall RCPurchaseController] Fetching product from RevenueCat: ${productId}`);
      const products = await Purchases.getProducts([productId]);
      const product = products.find((p) => p.identifier === productId);

      if (!product) {
        console.warn(`[Superwall RCPurchaseController] Product ${productId} not found in RevenueCat offerings.`);
        return new PurchaseResultFailed(`Product not found in RevenueCat: ${productId}`);
      }

      console.log(`[Superwall RCPurchaseController] Directing purchase of ${productId} to RevenueCat...`);
      const { customerInfo } = await Purchases.purchaseStoreProduct(product);
      
      const entitlementId = REVENUECAT_CONFIG.entitlementId;
      if (customerInfo?.entitlements?.active[entitlementId]) {
        console.log(`[Superwall RCPurchaseController] Purchase successful, premium entitlement active.`);
        return new PurchaseResultPurchased();
      } else {
        console.warn(`[Superwall RCPurchaseController] Purchase complete, but entitlement ${entitlementId} not active.`);
        return new PurchaseResultFailed('Purchase completed but entitlement is not active.');
      }
    } catch (error: any) {
      if (error?.userCancelled) {
        console.log(`[Superwall RCPurchaseController] Purchase cancelled by user.`);
        return new PurchaseResultCancelled();
      }
      console.error(`[Superwall RCPurchaseController] Purchase error:`, error);
      return new PurchaseResultFailed(error?.message || 'Purchase failed');
    }
  }

  async restorePurchases(): Promise<RestorationResult> {
    try {
      console.log(`[Superwall RCPurchaseController] Directing restore to RevenueCat...`);
      const customerInfo = await Purchases.restorePurchases();
      const entitlementId = REVENUECAT_CONFIG.entitlementId;
      if (customerInfo?.entitlements?.active[entitlementId]) {
        console.log(`[Superwall RCPurchaseController] Restore successful, premium entitlement active.`);
        return RestorationResult.restored();
      }
      console.warn(`[Superwall RCPurchaseController] Restore complete, but entitlement ${entitlementId} not active.`);
      return RestorationResult.failed(new Error('No premium entitlement found.'));
    } catch (error: any) {
      console.error(`[Superwall RCPurchaseController] Restore error:`, error);
      return RestorationResult.failed(error);
    }
  }
}
