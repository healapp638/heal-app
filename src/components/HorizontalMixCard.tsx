import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { triggerHaptic } from '../hooks/useHaptic';
interface HorizontalMixCardProps {
  image: any;
  title: string;
  style?: ViewStyle;
  onPress?: () => void;
}
const HorizontalMixCard = ({
  image,
  title,
  style,
  onPress,
}: HorizontalMixCardProps) => {
  return (
    <TouchableOpacity
      onPress={(...args: any) => {
        return (onPress as any)(...args);
      }}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={image}
        style={[styles.card, style]}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <SolidText maxFontScale={1.2} style={styles.title}>
          {title}
        </SolidText>
      </ImageBackground>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  imageStyle: {
    borderRadius: 20,
  },
  title: {
    fontSize: AppUtils.fontSize(22),
    fontFamily: AppFonts.recoMedium,
    color: 'white',
    textAlign: 'center',
  },
});
export default HorizontalMixCard;
