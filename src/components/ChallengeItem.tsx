import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface ChallengeItemProps {
  title: string;
  description?: string;
  points?: string;
  badge?: string;
  isCompleted: boolean;
  onPress?: () => void;
}

const ChallengeItem = ({
  title,
  description,
  points,
  badge,
  isCompleted,
  onPress,
}: ChallengeItemProps) => {
  const { colors, images } = useTheme() as any;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      {/* Top Left Badge Tag */}
      {badge && (
        <View style={styles.badgeContainer}>
          <Image
            source={images.time} // Using calendar as a fallback clock
            style={styles.badgeIcon}
            resizeMode="contain"
            tintColor="white"
          />
          <SolidText style={styles.badgeText}>{badge}</SolidText>
        </View>
      )}

      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <SolidText style={styles.titleText}>{title}</SolidText>
          {description && (
            <SolidText style={styles.descriptionText}>{description}</SolidText>
          )}
        </View>

        {/* Right Status Indicator */}
        {!isCompleted ? (
          <View
            style={[
              styles.statusContainer,
              { backgroundColor: isCompleted ? '#E5E1DA' : 'transparent' },
              !isCompleted && styles.pendingBorder,
            ]}
          >
            <SolidText style={styles.pointsText}>{points || '0 Pts'}</SolidText>
          </View>
        ) : (
          <Image
            source={images.tick2}
            style={styles.tickIcon}
            resizeMode="contain"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    // Immersive soft shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 3,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#604033', // Deep brown tag
    borderRadius: 14, // Pill shape
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 14,
  },
  badgeIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
  badgeText: {
    fontSize: AppUtils.fontSize(12),
    fontFamily: AppFonts.regular,
    color: '#F4EEE2', // Match screen background color for text
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  titleText: {
    fontSize: AppUtils.fontSize(14),
    fontFamily: AppFonts.semiBold,
    color: '#3A2110',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: AppUtils.fontSize(12),
    fontFamily: AppFonts.medium,
    color: '#3A2110',
    opacity: 0.8,
    lineHeight: 22,
  },
  statusContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingBorder: {
    borderWidth: 4, // Thicker border as in screenshot
    borderColor: '#D4CDC2', // Muted greyish border
  },
  tickIcon: {
    width: 36,
    height: 36,
  },
  pointsText: {
    fontSize: AppUtils.fontSize(12),
    fontFamily: AppFonts.semiBold,
    color: '#3A2110',
  },
});

export default ChallengeItem;
