import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Text,
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
  containerStyle?: any;
  disabled?: boolean;
}

const StartedModuleCard = ({
  title,
  subtitle,
  progressText,
  isFinished,
  onPress,
  containerStyle,
  disabled,
}: StartedModuleCardProps) => {
  const { colors, images } = useTheme() as any;
  const styles = useStyles(colors);
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.moduleCard,
        { backgroundColor: colors.white },
        containerStyle,
      ]}
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
          <Text
            numberOfLines={1}
            style={[styles.moduleCardSubtitle, { color: colors.brown }]}
          >
            {subtitle}
          </Text>
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
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderRadius: 16,
      marginRight: 12,
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 5,
      // Android shadow
      elevation: 2,
      marginBottom: 5,
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
    finishedCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,

      justifyContent: 'center',
      alignItems: 'center',
    },
    tickIcon: {
      width: 38,
      height: 38,
    },
    moduleCardTextContainer: {
      flex: 1,
      paddingHorizontal: 12,
    },
    moduleCardTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(14),
      marginBottom: Platform.OS == 'ios' ? 4 : 2,
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

export default React.memo(StartedModuleCard);
