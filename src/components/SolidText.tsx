import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, TextProps, StyleSheet, View, Platform } from 'react-native';
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
  const { colors } = useTheme();

  // On iOS, custom fonts break if fontWeight/fontStyle are present.
  // We sanitize the style aggressively on iOS to ensure custom fonts are always used.
  const processedStyle = React.useMemo(() => {
    const flatStyle = StyleSheet.flatten(style) || {};
    const variantStyle = styles[variant];
    
    // If either the variant or the custom style has a fontFamily, we must sanitize on iOS
    if (Platform.OS === 'ios' && (flatStyle.fontFamily || variantStyle.fontFamily)) {
      const cleaned = { ...flatStyle };
      
      // Remove these to prevent iOS from overriding the custom font with the system font
      if (cleaned.fontWeight) delete cleaned.fontWeight;
      if (cleaned.fontStyle) delete cleaned.fontStyle;
      
      return cleaned;
    }
    return flatStyle;
  }, [style, variant]);

  return (
    <Text
      {...props}
      style={[styles[variant], processedStyle]}
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
