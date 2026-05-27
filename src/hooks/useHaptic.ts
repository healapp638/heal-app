import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useCallback } from 'react';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

type HapticType =
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'selection';

export const triggerHaptic = (type: HapticType = 'impactMedium') => {
  ReactNativeHapticFeedback.trigger(type, options);
};

export const useHaptic = () => {
  const triggerHaptic = useCallback(
    (type: HapticType = 'impactMedium') => {
      ReactNativeHapticFeedback.trigger(type, options);
    },
    [],
  );

  return { triggerHaptic };
};
