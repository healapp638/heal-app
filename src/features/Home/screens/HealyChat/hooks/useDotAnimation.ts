import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useDotAnimation = (isSending: boolean) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation1: Animated.CompositeAnimation | null = null;
    let animation2: Animated.CompositeAnimation | null = null;
    let animation3: Animated.CompositeAnimation | null = null;

    if (isSending) {
      const animateDot = (value: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(value, {
              toValue: -4,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.delay(600 - delay),
          ]),
        );
      };

      animation1 = animateDot(dot1, 0);
      animation2 = animateDot(dot2, 150);
      animation3 = animateDot(dot3, 300);

      animation1.start();
      animation2.start();
      animation3.start();
    } else {
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    }

    return () => {
      if (animation1) animation1.stop();
      if (animation2) animation2.stop();
      if (animation3) animation3.stop();
    };
  }, [isSending, dot1, dot2, dot3]);

  return [dot1, dot2, dot3] as const;
};
