import React, { useState } from "react";
import { View } from "react-native";
import Toast from "../screens/components/Toast";

let showToastFn: (message: string, duration?: number) => void;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; duration?: number } | null>(null);

  showToastFn = (message: string, duration?: number) => {
    setToast({ message, duration });
  };

  const handleClose = () => {
    setToast(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {children}
      {toast && <Toast message={toast.message} duration={toast.duration} onClose={handleClose} />}
    </View>
  );
}

export const ToastService = {
  show: (message: string, duration?: number) => {
    if (showToastFn) showToastFn(message, duration);
  },
};
