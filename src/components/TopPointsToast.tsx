import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Platform,
  DeviceEventEmitter,
  PanResponder,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import { triggerHaptic } from '../hooks/useHaptic';

export const SHOW_POINTS_TOAST_EVENT = 'SHOW_POINTS_TOAST_EVENT';

export const showPointsToast = (message: string, points: string) => {
  DeviceEventEmitter.emit(SHOW_POINTS_TOAST_EVENT, { message, points });
};

export default function TopPointsToast() {
  const { colors } = useTheme() as any;
  const styles = useStyle(colors);
  const [toastData, setToastData] = useState<{
    message: string;
    points: string;
  } | null>(null);
  const slideAnim = useRef(new Animated.Value(-150)).current;

  const dismissToast = useCallback(() => {
    slideAnim.stopAnimation();
    Animated.timing(slideAnim, {
      toValue: -150,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setToastData(null);
    });
  }, [slideAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const isTap =
          Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;
        const isSwipeUp = gestureState.dy < -10 || gestureState.vy < -0.1;
        if (isTap || isSwipeUp) {
          dismissToast();
        }
      },
    }),
  ).current;

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      SHOW_POINTS_TOAST_EVENT,
      data => {
        triggerHaptic('impactHeavy');
        setToastData(data);
        slideAnim.setValue(-150);

        Animated.sequence([
          Animated.spring(slideAnim, {
            toValue: Platform.OS === 'ios' ? 60 : 40,
            useNativeDriver: true,
            bounciness: 12,
          }),
          Animated.delay(3500),
          Animated.timing(slideAnim, {
            toValue: -150,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(result => {
          if (result.finished) {
            setToastData(null);
          }
        });
      },
    );

    return () => {
      subscription.remove();
    };
  }, [slideAnim]);

  if (!toastData) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.content}>
        <View style={styles.pointsContainer}>
          <SolidText style={styles.pointsText}>{toastData.points}</SolidText>
        </View>
        <SolidText style={styles.messageText}>{toastData.message}</SolidText>
      </View>
    </Animated.View>
  );
}

const useStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: Platform.OS == 'ios' ? 0 : -20,
      left: 20,
      right: 20,
      zIndex: 99999,
    },
    content: {
      backgroundColor: colors.cardBeige || '#EBE0D0',
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    pointsContainer: {
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pointsText: {
      color: colors.primary || '#F66F76',
      fontFamily: AppFonts.semiBold,
      fontSize: 16,
    },
    messageText: {
      flex: 1,
      color: colors.brown || '#3A2110',
      fontFamily: AppFonts.medium,
      fontSize: 14,
      lineHeight: 20,
    },
  });
