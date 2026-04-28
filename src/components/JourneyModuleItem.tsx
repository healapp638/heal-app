import React from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface JourneyModuleItemProps {
  item: {
    id: string;
    title: string;
    subtitle: string;
    progress: number;
    level: number;
    isLocked: boolean;
  };
  localization: any;
}

const JourneyModuleItem = ({ item, localization }: JourneyModuleItemProps) => {
  const { colors, images } = useTheme() as any;

  if (item.isLocked) {
    return (
      <View key={item.id}>
        <ImageBackground
          source={images.lockedProgress}
          style={styles.lockedBackground}
          imageStyle={{ marginTop: -8 }}
          resizeMode="stretch"
        />
      </View>
    );
  }

  return (
    <View key={item.id} style={styles.moduleCard}>
      <View style={styles.moduleContent}>
        <View style={styles.moduleHeader}>
          <SolidText style={[styles.moduleTitle, { color: colors.brown }]}>
            {item.title}
          </SolidText>
          <View style={styles.levelBadge}>
            <SolidText style={styles.levelBadgeText}>
              {localization.appkeys.level} {item.level}
            </SolidText>
          </View>
        </View>
        <SolidText
          style={[styles.moduleSub, { color: colors.brown }]}
          numberOfLines={1}
        >
          {item.subtitle}
        </SolidText>

        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <SolidText style={[styles.progressLabel, { color: colors.brown }]}>
              {localization.appkeys.progress}
            </SolidText>
            <SolidText
              style={[styles.progressValue, { color: colors.lightBrown }]}
            >
              {item.progress}%
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
                  width: `${item.progress}%`,
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
    minHeight: 108,
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
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: AppUtils.fontSize(16),
    fontFamily: AppFonts.recoMedium,
    includeFontPadding: false,
  },
  levelBadge: {
    backgroundColor: '#352516',
    paddingHorizontal: 18,
    paddingVertical: 3,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: 'white',
    fontSize: AppUtils.fontSize(11),
    fontFamily: AppFonts.medium,
  },
  moduleSub: {
    fontSize: AppUtils.fontSize(12),
    fontFamily: AppFonts.regular,
    marginBottom: 12,
    includeFontPadding: false,
  },
  progressContainer: {
    marginTop: 'auto',
    marginBottom: 2,
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
  lockedBackground: {
    height: 90,
    width: '100%',
    marginTop: 8,
  },
});

export default JourneyModuleItem;
