import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface ProgressStatsCardProps {
  level: string | number;
  progress: string;
  pts: string;
  lvText: string;
  levelLabel: string;
  progressLabel: string;
  ptsLabel: string;
}

const ProgressStatsCard = ({
  level,
  progress,
  pts,
  lvText,
  levelLabel,
  progressLabel,
  ptsLabel,
}: ProgressStatsCardProps) => {
  const { colors } = useTheme() as any;

  return (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <SolidText style={[styles.statValue, { color: colors.brown }]}>
          {lvText} {level}
        </SolidText>
        <SolidText style={styles.statLabel}>{levelLabel}</SolidText>
      </View>
      <View style={styles.statItem}>
        <SolidText style={[styles.statValue, { color: colors.brown }]}>
          {progress}
        </SolidText>
        <SolidText style={styles.statLabel}>{progressLabel}</SolidText>
      </View>
      <View style={styles.statItem}>
        <SolidText style={[styles.statValue, { color: colors.brown }]}>
          {pts}
        </SolidText>
        <SolidText style={styles.statLabel}>{ptsLabel}</SolidText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFDBBB', // Specific beige from design specs
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: AppUtils.fontSize(18),
    fontFamily: AppFonts.recoMedium,
    includeFontPadding: false,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: AppUtils.fontSize(12),
    fontFamily: AppFonts.regular,
    color: 'rgba(0,0,0,0.4)',
    includeFontPadding: false,
  },
});

export default ProgressStatsCard;
