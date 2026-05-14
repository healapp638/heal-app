import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppUtils from '../utils/appUtils';
import AppFonts from '../constants/fonts';
import { useSelector } from 'react-redux';
import { triggerHaptic } from '../hooks/useHaptic';
interface ProgressTrackerCardProps {
  title: string;
  percentage?: string;
  level?: string;
  points?: string;
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
  const userDetails = useSelector((state: any) => state.userData.user);
  const displayPercentage =
    percentage ||
    (userDetails?.completedPercentage !== undefined
      ? `${Math.round(userDetails.completedPercentage)}%`
      : '0%');
  const displayLevel =
    level ||
    (userDetails?.currentLevel !== undefined
      ? `Level ${userDetails.currentLevel}`
      : 'Level 1');
  const displayPoints =
    points ||
    (userDetails?.total_earned_points !== undefined
      ? `${userDetails.total_earned_points}/${
          userDetails.total_points || 0
        } PTS`
      : '0/0 PTS');
  const progressWidth = Math.min(userDetails?.completedPercentage || 0, 100);
  return (
    <Pressable
      onPress={(...args: any) => {
        triggerHaptic('impactMedium');
        return (onPress as any)(...args);
      }}
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBeige,
        },
        viewStyle,
      ]}
    >
      <View style={styles.topRow}>
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
        <SolidText
          style={[
            styles.percentage,
            {
              color: colors.lightBrown,
            },
          ]}
        >
          {displayPercentage}
        </SolidText>
      </View>
      <View
        style={[
          styles.progressBarBg,
          {
            backgroundColor: colors.progressTrack,
          },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: colors.lightBrown,
              width: `${progressWidth}%`,
            },
          ]}
        />
      </View>
      <View style={styles.bottomRow}>
        <SolidText
          style={[
            styles.level,
            {
              color: colors.brown,
            },
          ]}
        >
          {displayLevel}
        </SolidText>
        <SolidText
          style={[
            styles.points,
            {
              color: colors.brown,
            },
          ]}
        >
          {displayPoints}
        </SolidText>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 10,
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
