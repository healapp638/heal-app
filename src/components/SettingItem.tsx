import React, { memo } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import style from '../features/settings/screens/Settings/style';

type SettingItemProps = {
  label: string;
  onPress?: () => void;
  isPink?: boolean;
  rightIcon?: any;
};

const SettingItem = ({
  label,
  onPress,
  isPink = false,
  rightIcon,
}: SettingItemProps) => {
  const { colors, images } = useTheme() as any;
  const styles = style(colors);

  if (isPink) {
    return (
      <TouchableOpacity
        style={styles.emergencyCard}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Image
          source={images.phone2}
          style={styles.phoneIcon}
          resizeMode="contain"
        />
        <SolidText style={styles.emergencyText}>{label}</SolidText>
        <Image
          source={images.forward2}
          style={styles.arrowIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.settingItem}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <SolidText style={styles.settingItemText}>{label}</SolidText>
      <Image
        source={rightIcon || images.forward2}
        style={rightIcon ? styles.toggleIcon : styles.arrowIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default memo(SettingItem);
