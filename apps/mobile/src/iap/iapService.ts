import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// Clés API à renseigner avant soumission stores (Phase 9)
const API_KEY_IOS = 'REVENUECAT_IOS_API_KEY_PLACEHOLDER';
const API_KEY_ANDROID = 'REVENUECAT_ANDROID_API_KEY_PLACEHOLDER';

export function initRevenueCat() {
  const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  Purchases.configure({ apiKey });
}

export async function checkPremiumEntitlement(): Promise<boolean> {
  try {
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active['premium'] !== undefined;
  } catch {
    return false;
  }
}

export async function purchasePremium(productId: string): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchaseProduct(productId);
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch {
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const info = await Purchases.restorePurchases();
    return info.entitlements.active['premium'] !== undefined;
  } catch {
    return false;
  }
}
