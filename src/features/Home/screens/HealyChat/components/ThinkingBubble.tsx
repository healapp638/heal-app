import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface ThinkingBubbleProps {
  logoSource: any;
  styles: any;
  tintColor?: string;
}

const ThinkingBubbleComponent: React.FC<ThinkingBubbleProps> = ({
  logoSource,
  styles,
  tintColor,
}) => {
  const fadeAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.2,
          duration: 950,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [fadeAnim]);

  return (
    <View style={[styles.messageContainer, styles.aiMessageContainer]}>
      <Animated.Image
        source={logoSource}
        style={{
          width: 22,
          height: 22,
          opacity: fadeAnim,
          tintColor: tintColor,
          marginLeft: 4,
          marginVertical: 12,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export const ThinkingBubble = React.memo(ThinkingBubbleComponent);
