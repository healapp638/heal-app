import React, { memo } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import style from '../features/settings/screens/Settings/style';
import { triggerHaptic } from '../hooks/useHaptic';
type SettingItemProps = {
  label: string;
  onPress?: () => void;
  isPink?: boolean;
  rightIcon?: any;
  rightIconStyle?: any;
  leftIcon?: any;
  leftIconStyle?: any;
};
const SettingItem = ({
  label,
  onPress,
  isPink = false,
  rightIcon,
  rightIconStyle,
  leftIcon,
  leftIconStyle,
}: SettingItemProps) => {
  const { colors, images } = useTheme() as any;
  const styles = style(colors);
  if (isPink) {
    return (
      <TouchableOpacity
        style={styles.emergencyCard}
        activeOpacity={0.8}
        onPress={(...args: any) => {
          return (onPress as any)(...args);
        }}
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
      onPress={(...args: any) => {
        return (onPress as any)(...args);
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={
              leftIconStyle || {
                width: 24,
                height: 24,
                marginRight: 12,
              }
            }
            resizeMode="contain"
          />
        )}
        <SolidText style={styles.settingItemText}>{label}</SolidText>
      </View>
      <Image
        source={rightIcon || images.forward2}
        style={
          rightIconStyle || (rightIcon ? styles.toggleIcon : styles.arrowIcon)
        }
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};
export default memo(SettingItem);
