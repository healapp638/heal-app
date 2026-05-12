import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { triggerHaptic } from '../hooks/useHaptic';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
interface GridThemeCardProps {
  image: any;
  onPress: () => void;
  style?: any;
}
const GridThemeCard = ({ image, onPress, style }: GridThemeCardProps) => {
  const { images } = useTheme() as any;
  return (
    <ImageBackground
      source={image}
      style={[styles.card, style]}
      imageStyle={styles.imageStyle}
      resizeMode="cover"
    >
      <Image
        source={images.h}
        style={[
          styles.hLogo,
          {
            position: 'absolute',
          },
        ]}
        resizeMode="contain"
      />
      <Pressable
        style={{
          height: '100%',
          width: '100%',
        }}
        onPress={(...args: any) => {
          return (onPress as any)(...args);
        }}
      ></Pressable>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: (SCREEN_WIDTH - 28) / 3 - 12,
    // Consistent width for 3 columns
    aspectRatio: 0.75,
    // Tall cards as per design
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    borderRadius: 18,
    overflow: 'hidden',
  },
  imageStyle: {
    borderRadius: 18,
  },
  hLogo: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
});
export default GridThemeCard;
