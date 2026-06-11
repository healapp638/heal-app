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

export const SUPERWALL_API_KEYS = {
  apple: 'pk__tn_USnOXf5BdSwBoKXOE', // Replace with your Superwall iOS API Key
  google: 'pk_IGVZ_hgwIWZ5-1wUISfWd', // Replace with your Superwall Android API Key
};

export const SUPERWALL_CONFIG = {
  apiKey: Platform.select({
    ios: SUPERWALL_API_KEYS.apple,
    android: SUPERWALL_API_KEYS.google,
    default: '',
  }),
};

