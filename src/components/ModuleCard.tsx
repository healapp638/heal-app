import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { triggerHaptic } from '../hooks/useHaptic';
interface ModuleCardProps {
  background: any;
  progress: string;
  title: string;
  category: string;
  onPress?: () => void;
}
const ModuleCard = ({
  background,
  progress,
  title,
  category,
  onPress,
}: ModuleCardProps) => {
  const { colors } = useTheme() as any;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={(...args: any) => {
        return (onPress as any)(...args);
      }}
      style={styles.container}
    >
      <ImageBackground
        source={background}
        style={styles.backgroundImage}
        imageStyle={{
          borderRadius: 18,
        }}
      >
        <View style={styles.overlay}>
          {/* Progress Pill */}
          <View style={styles.progressPill}>
            <SolidText style={styles.progressText}>{progress}</SolidText>
          </View>

          {/* Bottom Content */}
          <View style={styles.bottomContent}>
            <SolidText style={styles.titleText}>{title}</SolidText>
            <SolidText style={styles.categoryText}>{category}</SolidText>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '48%',
    height: 160,
    marginRight: 15,
    borderRadius: 18,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.1)', // Very subtle tint for contrast
  },
  progressPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 19,
    paddingVertical: 3,
    borderRadius: 20,
  },
  progressText: {
    fontSize: AppUtils.fontSize(12),
    fontFamily: AppFonts.semiBold,
    color: 'white',
    includeFontPadding: false,
  },
  bottomContent: {
    marginTop: 'auto',
  },
  titleText: {
    fontSize: AppUtils.fontSize(14),
    fontFamily: AppFonts.semiBold,
    color: 'white',
    lineHeight: 20,
    includeFontPadding: false,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: AppUtils.fontSize(10),
    fontFamily: AppFonts.semiBold,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
});
export default ModuleCard;
