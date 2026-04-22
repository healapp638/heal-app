import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppUtils from '../utils/appUtils';
import AppFonts from '../constants/fonts';

interface ProgressTrackerCardProps {
  title: string;
  percentage: string;
  level: string;
  points: string;
  onPress?: () => void;
  viewStyle?: any;
}

const ProgressTrackerCard = ({
  title,
  percentage,
  level,
  points,
  onPress,
  viewStyle,
}: ProgressTrackerCardProps) => {
  const { colors } = useTheme() as any;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.cardBeige }, viewStyle]}
    >
      <View style={styles.topRow}>
        <SolidText style={[styles.title, { color: colors.brown }]}>
          {title}
        </SolidText>
        <SolidText style={[styles.percentage, { color: colors.lightBrown }]}>
          {percentage}
        </SolidText>
      </View>
      <View
        style={[
          styles.progressBarBg,
          { backgroundColor: colors.progressTrack },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            { backgroundColor: colors.lightBrown, width: '40%' },
          ]}
        />
      </View>
      <View style={styles.bottomRow}>
        <SolidText style={[styles.level, { color: colors.brown }]}>
          {level}
        </SolidText>
        <SolidText style={[styles.points, { color: colors.brown }]}>
          {points}
        </SolidText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 12,
    fontFamily: AppFonts.medium,
    includeFontPadding: false,
  },
  percentage: {
    fontSize: 12,
    fontFamily: AppFonts.semiBold,
    includeFontPadding: false,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  level: {
    fontSize: 12,
    fontFamily: AppFonts.semiBold,
    opacity: 0.6,
    includeFontPadding: false,
  },
  points: {
    fontSize: 10,
    fontFamily: AppFonts.medium,
    opacity: 0.6,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
});

export default ProgressTrackerCard;
