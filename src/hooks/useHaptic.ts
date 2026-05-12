import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useCallback } from 'react';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const triggerHaptic = (
  type: 'impactLight' | 'impactMedium' | 'impactHeavy' | 'selection' = 'impactMedium'
) => {
  ReactNativeHapticFeedback.trigger(type, options);
};

export const useHaptic = () => {
  const triggerHaptic = useCallback(
    (
      type:
        | 'impactHeavy'
        | 'impactMedium'
        | 'impactHeavy'
        | 'selection' = 'impactMedium',
    ) => {
      ReactNativeHapticFeedback.trigger(type, options);
    },
    [],
  );

  return { triggerHaptic };
};
