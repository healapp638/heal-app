import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { triggerHaptic } from '../hooks/useHaptic';
import Animated, {
  FadeIn,
  FadeOut,
  Easing,
  SlideInDown,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GridThemeCardProps {
  image: any;
  onPress: () => void;
  style?: any;
  isMostPopular?: boolean;
  activeCategory?: string;
  itemId?: string;
  index?: number;
}

const GridThemeCard = ({
  image,
  onPress,
  style,
  isMostPopular,
  activeCategory,
  itemId,
  index = 0,
}: GridThemeCardProps) => {
  const { images } = useTheme() as any;

  const getEnteringAnimation = () => {
    if (activeCategory === 'most_popular') {
      return SlideInDown;
    }
    return FadeIn;
  };

  const Animation = getEnteringAnimation();

  return (
    <Animated.View
      entering={Animation.duration(800)
        .delay(index * 30)
        .easing(Easing.inOut(Easing.ease))}
      exiting={FadeOut.duration(800).easing(Easing.inOut(Easing.ease))}
      style={[styles.card, style]}
    >
      <ImageBackground
        source={image}
        style={{ flex: 1, width: '100%', height: '100%' }}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        {/* <Image
          source={images.h}
          style={[
            styles.hLogo,
            {
              position: 'absolute',
            },
          ]}
          resizeMode="contain"
        /> */}
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
    </Animated.View>
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
