import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { triggerHaptic } from '../hooks/useHaptic';
interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  containerStyle?: object;
}
const SectionHeader = ({
  title,
  actionLabel,
  onActionPress,
  containerStyle,
}: SectionHeaderProps) => {
  const { colors } = useTheme() as any;
  return (
    <View style={[styles.container, containerStyle]}>
      <SolidText
        maxFontScale={1.2}
        style={[
          styles.title,
          {
            color: colors.brown,
          },
        ]}
      >
        {title}
      </SolidText>
      {actionLabel && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={(...args: any) => {
            return (onActionPress as any)(...args);
          }}
        >
          <SolidText
            style={[
              styles.actionLabel,
              {
                color: colors.primary,
              },
            ]}
            maxFontScale={1}
          >
            {actionLabel}
          </SolidText>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: AppUtils.fontSize(16),
    fontFamily: AppFonts.semiBold,
    includeFontPadding: false,
  },
  actionLabel: {
    fontSize: AppUtils.fontSize(15),
    fontFamily: AppFonts.medium,
    includeFontPadding: false,
  },
});
export default SectionHeader;
