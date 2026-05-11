import React from 'react';
import {
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';

interface CategoryGridCardProps {
  image: any;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

const CategoryGridCard = ({
  image,
  title,
  onPress,
  style,
}: CategoryGridCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={image}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <SolidText style={styles.title}>{title}</SolidText>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '47.5%',
    height: 100,
    margin: 5,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: AppFonts.recoMedium,
    textAlign: 'center',
  },
});

export default CategoryGridCard;
