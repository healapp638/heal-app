import React from 'react';
import { View, Animated } from 'react-native';

interface ThinkingBubbleProps {
  dot1: Animated.Value;
  dot2: Animated.Value;
  dot3: Animated.Value;
  styles: any;
}

const ThinkingBubbleComponent: React.FC<ThinkingBubbleProps> = ({
  dot1,
  dot2,
  dot3,
  styles,
}) => {
  return (
    <View
      style={[
        styles.messageContainer,
        styles.aiMessageContainer,
      ]}
    >
      <View
        style={[
          styles.aiBubble,
          styles.thinkingBubbleContainer,
        ]}
      >
        <Animated.View
          style={[
            styles.thinkingDot,
            { transform: [{ translateY: dot1 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.thinkingDot,
            { transform: [{ translateY: dot2 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.thinkingDot,
            { transform: [{ translateY: dot3 }] },
          ]}
        />
      </View>
    </View>
  );
};

export const ThinkingBubble = React.memo(ThinkingBubbleComponent);
