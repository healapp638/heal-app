import React, { useRef, useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Platform, DeviceEventEmitter } from 'react-native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';

export const SHOW_POINTS_TOAST_EVENT = 'SHOW_POINTS_TOAST_EVENT';

export const showPointsToast = (message: string, points: string) => {
  DeviceEventEmitter.emit(SHOW_POINTS_TOAST_EVENT, { message, points });
};

export default function TopPointsToast() {
  const [toastData, setToastData] = useState<{ message: string; points: string } | null>(null);
  const slideAnim = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(SHOW_POINTS_TOAST_EVENT, (data) => {
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
      ]).start(() => {
        setToastData(null);
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!toastData) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]} pointerEvents="none">
      <View style={styles.content}>
        <View style={styles.pointsContainer}>
          <SolidText style={styles.pointsText}>{toastData.points}</SolidText>
        </View>
        <SolidText style={styles.messageText}>{toastData.message}</SolidText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -20,
    left: 20,
    right: 20,
    zIndex: 99999,
  },
  content: {
    backgroundColor: '#302A28',
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
    color: '#F66F76',
    fontFamily: AppFonts.semiBold,
    fontSize: 16,
  },
  messageText: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: AppFonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
});
