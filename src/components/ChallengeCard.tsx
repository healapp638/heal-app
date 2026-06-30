import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { triggerHaptic } from '../hooks/useHaptic';
interface ChallengeCardProps {
  title: string;
  duration: string;
  onPress?: () => void;
}
const ChallengeCard = ({ title, duration, onPress }: ChallengeCardProps) => {
  const { colors, images } = useTheme() as any;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={(...args: any) => {
        return (onPress as any)(...args);
      }}
      style={styles.container}
    >
      <ImageBackground
        source={images.completeChallenge}
        style={styles.backgroundImage}
        imageStyle={{
          borderRadius: 14,
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.leftSection}>
            <Image
              source={images.book}
              style={styles.iconStyles}
              resizeMode="contain"
            />

            <View style={styles.textSection}>
              <SolidText maxFontScale={1.2} style={styles.challengeTitle}>
                {title}
              </SolidText>
              <SolidText maxFontScale={1.2} style={styles.timeText}>
                {duration}
              </SolidText>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Image
              source={images.ok}
              style={styles.iconStyles}
              resizeMode="contain"
            />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 90,
    width: '100%',
    marginVertical: 10,
    borderRadius: 14,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: 'rgba(0,0,0,0.15)', // Subtle darkening for text legibility
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconStyles: {
    width: 34,
    height: 34,
    tintColor: 'white',
  },
  textSection: {
    flex: 1,
    marginLeft: 10,
  },
  challengeTitle: {
    fontSize: AppUtils.fontSize(14),
    fontFamily: AppFonts.semiBold,
    color: 'white',
    includeFontPadding: false,
  },
  timeText: {
    fontSize: AppUtils.fontSize(12),
    fontFamily: AppFonts.medium,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    opacity: 0.6,
    includeFontPadding: false,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ChallengeCard;
