import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useCallback } from 'react';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

export const triggerHaptic = (
  type:
    | 'impactLight'
    | 'impactMedium'
    | 'impactMedium'
    | 'selection' = 'impactMedium',
) => {
  ReactNativeHapticFeedback.trigger(type, options);
};

export const useHaptic = () => {
  const triggerHaptic = useCallback(
    (
      type:
        | 'impactMedium'
        | 'impactMedium'
        | 'impactMedium'
        | 'selection' = 'impactMedium',
    ) => {
      ReactNativeHapticFeedback.trigger(type, options);
    },
    [],
  );

  return { triggerHaptic };
};
