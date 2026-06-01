import React from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface JourneyModuleItemProps {
  item: {
    id?: string;
    _id?: string;
    title?: string;
    name?: string;
    subtitle?: string;
    description?: string;
    progress?: number;
    completedPercentage?: number;
    level?: number;
    isLocked?: boolean;
    is_locked?: boolean;
    [key: string]: any;
  };
  localization: any;
}

const JourneyModuleItem = ({ item, localization }: JourneyModuleItemProps) => {
  const { colors, images } = useTheme() as any;

  const isLocked =
    item.isLocked || item.is_locked || item.level_status === 'pending' || false;
  const level = item.level ?? item.level_number ?? 1;
  const progress = item.progress ?? item.completedPercentage ?? 0;
  const points =
    item.points ??
    item.pts ??
    item.current_points ??
    item.completed_points ??
    item.earned_point ??
    0;
  const totalPoints =
    item.totalPoints ??
    item.total_points ??
    item.max_points ??
    item.target_points ??
    100;
  const hasPoints = points !== undefined;
  const isCompleted = item.level_status === 'completed' || progress === 100;

  const title = `${localization.appkeys.level} ${level}`;

  if (isLocked) {
    return (
      <View
        key={item.id || item._id}
        style={[styles.moduleCard, styles.lockedCard]}
      >
        <View style={styles.mutedContent}>
          <View style={styles.moduleHeader}>
            <SolidText style={[styles.moduleTitle, { color: colors.brown }]}>
              {title}
            </SolidText>
            <View style={styles.levelBadge}>
              <SolidText style={styles.levelBadgeText}>
                {`${points}/${totalPoints} pts`}
              </SolidText>
            </View>
          </View>

          <View style={[styles.progressContainer, { marginTop: 16 }]}>
            <View style={styles.progressLabelRow}>
              <SolidText
                style={[styles.progressLabel, { color: colors.brown }]}
              >
                {localization.appkeys.progress}
              </SolidText>
              <SolidText
                style={[styles.progressValue, { color: colors.lightBrown }]}
              >
                0%
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
                  {
                    width: '0%',
                    backgroundColor: colors.lightBrown,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.lockOverlay}>
          <Image
            source={images.lock}
            style={styles.lockIcon}
            resizeMode="contain"
            tintColor="#3A2110"
          />
        </View>
      </View>
    );
  }

  return (
    <View key={item.id || item._id} style={styles.moduleCard}>
      <View style={styles.moduleContent}>
        <View style={styles.moduleHeader}>
          <SolidText style={[styles.moduleTitle, { color: colors.brown }]}>
            {title}
          </SolidText>
          <View style={styles.levelBadge}>
            <SolidText style={styles.levelBadgeText}>
              {isCompleted
                ? localization.appkeys.completed
                : hasPoints
                ? `${points}/${totalPoints} pts`
                : `${localization.appkeys.level} ${level}`}
            </SolidText>
          </View>
        </View>

        <View style={[styles.progressContainer, { marginTop: 16 }]}>
          <View style={styles.progressLabelRow}>
            <SolidText style={[styles.progressLabel, { color: colors.brown }]}>
              {localization.appkeys.progress}
            </SolidText>
            <SolidText
              style={[styles.progressValue, { color: colors.lightBrown }]}
            >
              {progress}%
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
                {
                  width: `${progress}%`,
                  backgroundColor: colors.lightBrown,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  moduleCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF0F2',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    overflow: 'hidden',
  },
  moduleContent: {
    flex: 1,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: AppUtils.fontSize(16),
    fontFamily: AppFonts.recoMedium,
    includeFontPadding: false,
  },
  levelBadge: {
    backgroundColor: '#352516',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: 'white',
    fontSize: AppUtils.fontSize(11),
    fontFamily: AppFonts.medium,
    includeFontPadding: false,
  },
  moduleSub: {
    fontSize: AppUtils.fontSize(12),
    fontFamily: AppFonts.regular,
    marginBottom: 12,
    includeFontPadding: false,
  },
  progressContainer: {
    marginTop: 'auto',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: AppUtils.fontSize(11),
    fontFamily: AppFonts.medium,
  },
  progressValue: {
    fontSize: AppUtils.fontSize(11),
    fontFamily: AppFonts.semiBold,
    marginBottom: 8,
    includeFontPadding: false,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  lockedCard: {
    borderColor: '#3A2110',
    borderWidth: 1,
  },
  mutedContent: {
    flex: 1,
    opacity: 0.35,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(70,50,37,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  lockIcon: {
    width: 40,
    height: 40,
  },
});

export default JourneyModuleItem;
