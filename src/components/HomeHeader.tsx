import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppUtils from '../utils/appUtils';
import AppFonts from '../constants/fonts';
import { triggerHaptic } from '../hooks/useHaptic';
interface HomeHeaderProps {
  userName: string;
  safeSpaceLabel: string;
  streakCount: number;
  onStreakPress: () => void;
  onCalendarPress?: () => void;
  showStreak?: boolean;
  showCrown?: boolean;
  onCrownPress?: () => void;
  viewStyle?: ViewStyle;
  subStyle?: ViewStyle;
}
const HomeHeader = ({
  userName,
  safeSpaceLabel,
  streakCount,
  onStreakPress,
  onCalendarPress,
  showStreak = true,
  showCrown,
  onCrownPress,
  viewStyle,
  subStyle,
}: HomeHeaderProps) => {
  const { colors, images } = useTheme() as any;
  return (
    <View style={[styles.header, viewStyle]}>
      <View>
        <SolidText
          style={[
            styles.userName,
            {
              color: colors.brown,
            },
          ]}
        >
          {userName}
        </SolidText>
        <SolidText
          style={[
            styles.safeSpace,
            {
              color: colors.brown,
            },
            subStyle,
          ]}
        >
          {safeSpaceLabel}
        </SolidText>
      </View>
      {showStreak && (
        <Pressable
          onPress={(...args: any) => {
            return (onStreakPress as any)(...args);
          }}
          style={styles.headerRight}
        >
          <View style={styles.streakBox}>
            <Image
              source={images.streak}
              style={styles.icon}
              resizeMode="contain"
            />
            <SolidText
              style={[
                styles.streakText,
                {
                  color: colors.brown,
                },
              ]}
            >
              {streakCount}
            </SolidText>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={(...args: any) => {
                return (onCalendarPress as any)(...args);
              }}
            >
              <Image
                source={images.calendar}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
      {showCrown && (
        <Pressable
          onPress={(...args: any) => {
            return (onCrownPress as any)(...args);
          }}
        >
          <Image
            source={images.crown}
            tintColor={colors.brown}
            style={{
              height: 18,
              width: 18,
            }} // Reusing same icon size constraints
            resizeMode="contain"
          />
        </Pressable>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontSize: AppUtils.fontSize(23),
    fontFamily: AppFonts.recoMedium,
    includeFontPadding: false,
  },
  safeSpace: {
    fontSize: AppUtils.fontSize(14),
    fontFamily: AppFonts.regular,
    includeFontPadding: false,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    marginTop: -8,
  },
  icon: {
    width: 16,
    height: 16,
  },
  streakText: {
    fontSize: AppUtils.fontSize(14),
    fontFamily: AppFonts.semiBold,
    marginLeft: 2,
    includeFontPadding: false,
  },
  divider: {
    width: 1.5,
    height: 18,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 10,
    marginRight: 11,
  },
});
export default HomeHeader;
