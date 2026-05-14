import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useCallback } from 'react';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

export const triggerHaptic = (
  type:
    | 'impactLight'
    | 'impactLight'
    | 'impactLight'
    | 'selection' = 'impactLight',
) => {
  ReactNativeHapticFeedback.trigger(type, options);
};

export const useHaptic = () => {
  const triggerHaptic = useCallback(
    (
      type:
        | 'impactLight'
        | 'impactLight'
        | 'impactLight'
        | 'selection' = 'impactLight',
    ) => {
      ReactNativeHapticFeedback.trigger(type, options);
    },
    [],
  );

  return { triggerHaptic };
};
