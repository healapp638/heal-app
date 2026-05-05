import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface ModuleThemeCardProps {
  item: any;
  onPress?: () => void;
}

const ModuleThemeCard = ({ item, onPress }: ModuleThemeCardProps) => {
  const { colors, images } = useTheme() as any;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.themeCard, { backgroundColor: colors.white }]}
      onPress={onPress}
    >
      <Image
        source={
          typeof item.icon === 'string' ? { uri: item.icon } : item.icon
        }
        style={styles.themeIcon}
        resizeMode="contain"
      />
      <SolidText style={[styles.themeLabel, { color: colors.brown }]}>
        {item.title || item.label}
      </SolidText>
      <Image
        source={images.forward2}
        style={styles.forwardIcon}
        resizeMode="contain"
        tintColor={colors.brown}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  themeCard: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    // Android shadow
    elevation: 2,
  },
  themeIcon: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  themeLabel: {
    flex: 1,
    fontFamily: AppFonts.regular,
    fontSize: AppUtils.fontSize(15),
  },
  forwardIcon: {
    width: 12,
    height: 12,
  },
});

export default ModuleThemeCard;
