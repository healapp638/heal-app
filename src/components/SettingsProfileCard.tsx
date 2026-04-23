import React, { memo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import style from '../features/settings/screens/Settings/style';

type SettingsProfileCardProps = {
  userName: string;
  userEmail: string;
  onLogoutPress?: () => void;
};

const SettingsProfileCard = ({
  userName,
  userEmail,
  onLogoutPress,
}: SettingsProfileCardProps) => {
  const { colors, images } = useTheme() as any;
  const styles = style(colors);

  return (
    <View style={styles.profileCard}>
      <Image source={images.avatar} style={styles.avatar} />
      <View style={styles.profileInfo}>
        <SolidText style={styles.userName}>{userName}</SolidText>
        <SolidText style={styles.userEmail}>{userEmail}</SolidText>
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={onLogoutPress}>
        <Image
          source={images.logout}
          style={styles.logoutIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(SettingsProfileCard);
