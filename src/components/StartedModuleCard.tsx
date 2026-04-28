import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface StartedModuleCardProps {
  title: string;
  subtitle: string;
  progressText?: string;
  isFinished?: boolean;
  onPress?: () => void;
}

const StartedModuleCard = ({
  title,
  subtitle,
  progressText,
  isFinished,
  onPress,
}: StartedModuleCardProps) => {
  const { colors, images } = useTheme() as any;
  const styles = useStyles(colors);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.moduleCard, { backgroundColor: colors.white }]}
    >
      <View style={styles.moduleCardContent}>
        {isFinished ? (
          <View style={styles.finishedCircle}>
            <Image
              source={images.tick2}
              style={styles.tickIcon}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View
            style={[
              styles.progressCircleContainer,
              {
                borderColor: '#EBE0D0',
                borderTopColor: colors.lightBrown,
                borderRightColor: colors.lightBrown,
              },
            ]}
          >
            <View style={styles.progressCircleInner}>
              <SolidText style={[styles.progressText, { color: colors.brown }]}>
                {progressText}
              </SolidText>
            </View>
          </View>
        )}

        <View style={styles.moduleCardTextContainer}>
          <SolidText style={[styles.moduleCardTitle, { color: colors.brown }]}>
            {title}
          </SolidText>
          <SolidText
            style={[styles.moduleCardSubtitle, { color: colors.brown }]}
          >
            {subtitle}
          </SolidText>
        </View>
        <Image
          source={images.forward2}
          style={styles.forwardIcon}
          resizeMode="contain"
          tintColor={colors.brown}
        />
      </View>
    </TouchableOpacity>
  );
};

const useStyles = (colors: any) =>
  StyleSheet.create({
    moduleCard: {
      width: 320,
      padding: 12,
      borderRadius: 16,
      marginRight: 12,
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 5,
      // Android shadow
      elevation: 2,
    },
    moduleCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressCircleContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 6,
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ rotate: '45deg' }],
    },
    progressCircleInner: {
      transform: [{ rotate: '-45deg' }],
    },
    progressText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(14),
      includeFontPadding: false,
    },
    finishedCircle: {},
    tickIcon: {
      width: 36,
      height: 36,
    },
    moduleCardTextContainer: {
      flex: 1,
      paddingHorizontal: 12,
    },
    moduleCardTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(14),
      marginBottom: Platform.OS == 'ios' ? 13 : 7,
    },
    moduleCardSubtitle: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(11),
      opacity: 0.5,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    forwardIcon: {
      width: 12,
      height: 12,
    },
  });

export default StartedModuleCard;
