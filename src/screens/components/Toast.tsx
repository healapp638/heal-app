import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type ToastProps = {
  message: string;
  duration?: number;
  onClose: () => void;
};

export default function Toast({ message, duration = 2000, onClose }: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  }, []);

  return (
    <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
  },
});
