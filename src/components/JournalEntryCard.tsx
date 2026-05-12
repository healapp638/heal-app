import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { triggerHaptic } from '../hooks/useHaptic';
interface JournalEntryCardProps {
  time: string;
  tag: string;
  title: string;
  body: string;
  onPress?: () => void;
}
const JournalEntryCard = ({
  time,
  tag,
  title,
  body,
  onPress,
}: JournalEntryCardProps) => {
  const { colors } = useTheme() as any;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={(...args: any) => {
        return (onPress as any)(...args);
      }}
      style={styles.cardContainer}
    >
      <View style={styles.topRow}>
        <SolidText style={styles.timeText}>{time}</SolidText>
        <View
          style={[
            styles.tagPill,
            {
              backgroundColor: colors.brown,
            },
          ]}
        >
          <SolidText style={styles.tagText}>{tag}</SolidText>
        </View>
      </View>

      <SolidText
        style={[
          styles.title,
          {
            color: colors.brown,
          },
        ]}
      >
        {title}
      </SolidText>

      <SolidText style={styles.bodyText} numberOfLines={2}>
        {body}
      </SolidText>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    // Android shadow
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontFamily: AppFonts.medium,
    fontSize: AppUtils.fontSize(12),
    color: '#A1948B',
  },
  tagPill: {
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tagText: {
    fontFamily: AppFonts.medium,
    fontSize: AppUtils.fontSize(12),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  title: {
    fontFamily: AppFonts.recoSemiBold,
    fontSize: AppUtils.fontSize(16),
    marginBottom: Platform.OS == 'ios' ? 7 : 6,
    includeFontPadding: false,
  },
  bodyText: {
    fontFamily: AppFonts.regular,
    fontSize: AppUtils.fontSize(14),
    color: '#4B4B4B',
    lineHeight: Platform.OS == 'ios' ? 20 : 19,
  },
});
export default JournalEntryCard;
