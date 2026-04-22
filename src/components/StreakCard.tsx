import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

const { width } = Dimensions.get('window');

interface StreakCardProps {
  streakCount?: number;
  activeStreakLabel?: string;
}

const StreakCard = ({
  streakCount = 3,
  activeStreakLabel = 'Active Streak',
}: StreakCardProps) => {
  const { colors, images } = useTheme() as any;

  // Mock days data mapping to the screenshot provided
  const days = [
    { day: 'Mo', status: 'none' },
    { day: 'Tu', status: 'none' },
    { day: 'We', status: 'none' },
    { day: 'Th', status: 'completed' },
    { day: 'Fr', status: 'completed' },
    { day: 'Sa', status: 'active' },
    { day: 'Su', status: 'none' },
  ];

  return (
    <View style={styles.cardContainer}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <SolidText style={[styles.title, { color: colors.brown }]}>
          {activeStreakLabel}
        </SolidText>
        <View style={styles.badgeContainer}>
          <Image
            source={images.streak}
            style={styles.badgeIcon}
            resizeMode="contain"
          />
          <SolidText style={[styles.badgeText, { color: colors.brown }]}>
            {streakCount}
          </SolidText>
        </View>
      </View>

      {/* Days Progress Row */}
      <View style={styles.daysRow}>
        {days.map((item, index) => {
          const isActive = item.status === 'active';
          const isCompleted = item.status === 'completed';
          const isNone = item.status === 'none';

          return (
            <View key={index} style={styles.dayItem}>
              <SolidText
                style={[
                  styles.dayLabel,
                  {
                    color:
                      isActive || isCompleted ? colors.primary : colors.brown,
                  },
                ]}
              >
                {item.day}
              </SolidText>
              <View
                style={[
                  styles.statusCircle,
                  isActive && styles.activeCircle,
                  isCompleted && styles.completedCircle,
                  isNone && { borderColor: '#E8EDF1', borderWidth: 2 },
                  (isActive || isCompleted) && {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Image
                  source={images.streak}
                  style={[
                    styles.streakIcon,
                    isActive && styles.activeIcon,
                    isCompleted && styles.completedIcon,
                    isNone && { tintColor: '#D1D9E0' },
                    (isActive || isCompleted) && { tintColor: 'white' },
                  ]}
                  resizeMode="contain"
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
    marginTop: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: AppUtils.fontSize(16),
    fontFamily: AppFonts.medium,
    includeFontPadding: false,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F5F7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeIcon: {
    width: 15,
    height: 15,
    marginRight: 6,
    tintColor: '#F66F76',
  },
  badgeText: {
    fontSize: AppUtils.fontSize(13),
    fontFamily: AppFonts.semiBold,
    includeFontPadding: false,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dayItem: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: AppUtils.fontSize(12),
    fontFamily: AppFonts.semiBold,
    marginBottom: 10,
    includeFontPadding: false,
  },
  statusCircle: {
    width: 30,
    height: 30,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  completedCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  streakIcon: {
    width: 14,
    height: 14,
  },
  activeIcon: {
    width: 24,
    height: 24,
  },
  completedIcon: {
    width: 16,
    height: 16,
  },
});

export default StreakCard;
