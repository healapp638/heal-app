import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface ConnectedPillProps {
  label: string;
  count: string;
  onPress?: () => void;
}

const ConnectedPill = ({ label, count, onPress }: ConnectedPillProps) => {
  const { colors } = useTheme() as any;

  return (
    <TouchableOpacity
      style={[styles.connectedPill, { backgroundColor: colors.calendarPill }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[styles.connectedDot, { backgroundColor: colors.calendarDayBrown }]}
      />
      <SolidText style={[styles.connectedText, { color: colors.calendarDayBrown }]}>
        {label}
      </SolidText>
      <SolidText style={[styles.connectedCount, { color: colors.calendarDayBrown }]}>
        {count}
      </SolidText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  connectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  connectedText: {
    fontFamily: AppFonts.regular,
    fontSize: AppUtils.fontSize(13),
    includeFontPadding: false,
  },
  connectedCount: {
    fontFamily: AppFonts.regular,
    fontSize: AppUtils.fontSize(13),
    includeFontPadding: false,
  },
});

export default ConnectedPill;
