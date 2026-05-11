import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, TextProps, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import AppFonts from '../constants/fonts';

// Default font scaling (prevent breaking layouts with large accessibility text)
// You can tune this per design requirement

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  maxFontScale?: number; // override per usage if needed
  variant?: 'bold' | 'medium' | 'regular' | 'semibold';
}

const SolidText: React.FC<AppTextProps> = ({
  children,
  maxFontScale,
  variant = 'regular',
  style,
  ...props
}) => {
  const fontScaling = useSelector((state: any) => state.userData.fontScaling);
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      style={[styles[variant], style]}
      maxFontSizeMultiplier={maxFontScale ?? 1.4}
      allowFontScaling
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: AppFonts.bold,
    color: 'white',
    fontSize: 17,
  },
  medium: {
    fontFamily: AppFonts.medium,
    color: 'white',
    fontSize: 17,
  },
  regular: {
    fontFamily: AppFonts.regular,
    color: 'white',
    fontSize: 17,
  },
  semibold: {
    fontFamily: AppFonts.semiBold,
    color: 'white',
    fontSize: 17,
  },
});

export default SolidText;
