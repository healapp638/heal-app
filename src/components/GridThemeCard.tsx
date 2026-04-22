import React from 'react';
import { ImageBackground, StyleSheet, View, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface GridThemeCardProps {
  image: any;
}

const GridThemeCard = ({ image }: GridThemeCardProps) => {
  const { images } = useTheme() as any;

  return (
    <ImageBackground
      source={image}
      style={styles.card}
      imageStyle={styles.imageStyle}
      resizeMode="contain"
    >
      {/* <Image source={images.h} style={styles.hLogo} resizeMode="contain" /> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 0.75, // Tall cards as per design
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
    width: 50,
    height: 50,
    tintColor: 'white',
  },
});

export default GridThemeCard;
