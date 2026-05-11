import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface PhaseCardProps {
  phase: string;
  title: string;
  points: string;
  isLocked?: boolean;
  isCompleted?: boolean;
  onPress?: () => void;
}

const PhaseCard = ({
  phase,
  title,
  points,
  isLocked = false,
  isCompleted = false,
  onPress,
}: PhaseCardProps) => {
  const { colors, images } = useTheme() as any;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isLocked}
      style={[styles.card, { backgroundColor: colors.white }]}
    >
      <View style={styles.leftContainer}>
        <SolidText style={[styles.phaseText, { color: colors.brown }]}>
          {phase}
        </SolidText>
        <SolidText style={[styles.titleText, { color: colors.brown }]}>
          {title}
        </SolidText>
        <SolidText style={styles.pointsText}>{points}</SolidText>
      </View>
      <View style={styles.rightContainer}>
        {isLocked ? (
          <Image
            source={images.lock3}
            style={styles.lockIcon}
            resizeMode="contain"
          />
        ) : isCompleted ? (
          <Image
            source={images.tick2}
            style={styles.tickIcon}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={images.forward2}
            style={styles.forwardIcon}
            resizeMode="contain"
            tintColor={colors.brown}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 10,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    // Android shadow
    elevation: 2,
  },
  leftContainer: {
    flex: 1,
    paddingRight: 10,
  },
  phaseText: {
    fontFamily: AppFonts.recoSemiBold,
    fontSize: AppUtils.fontSize(18),
    marginBottom: 8,
  },
  titleText: {
    fontFamily: AppFonts.semiBold,
    fontSize: AppUtils.fontSize(14),
    marginBottom: 6,
  },
  pointsText: {
    fontFamily: AppFonts.regular,
    fontSize: AppUtils.fontSize(12),
    color: '#909090',
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBE0D0', // Match the gray/beige background seen in the design
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    width: 36,
    height: 36,
  },
  forwardIcon: {
    width: 14,
    height: 14,
  },
  tickIcon: {
    width: 34,
    height: 34,
  },
});

export default React.memo(PhaseCard);
