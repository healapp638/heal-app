import { Platform } from 'react-native';

export const REVENUECAT_API_KEYS = {
  apple: 'appl_XWcPcoztUPezrWhorBUdJwiwqTU', // Replace with your Apple API Key from RevenueCat dashboard
  google: 'goog_LltgwmNHEQmaOqHSYttsqSFQjvg', // Replace with your Google API Key from RevenueCat dashboard
};

export const REVENUECAT_CONFIG = {
  apiKey: Platform.select({
    ios: REVENUECAT_API_KEYS.apple,
    android: REVENUECAT_API_KEYS.google,
    default: '',
  }),
  entitlementId: 'premium',
  offeringId: 'trial_offering',
};

