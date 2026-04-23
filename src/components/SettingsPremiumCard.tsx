import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import style from '../features/settings/screens/Settings/style';

type SettingsPremiumCardProps = {
  description: string;
  priceLabel: string;
  discoverLabel: string;
  onDiscoverPress?: () => void;
};

const SettingsPremiumCard = ({
  description,
  priceLabel,
  discoverLabel,
  onDiscoverPress,
}: SettingsPremiumCardProps) => {
  const { colors } = useTheme() as any;
  const styles = style(colors);

  return (
    <View style={styles.premiumCard}>
      <SolidText style={styles.premiumText}>
        {description}{' '}
        <SolidText style={styles.premiumBold}>{priceLabel}</SolidText>
      </SolidText>

      <TouchableOpacity
        style={styles.discoverBtn}
        activeOpacity={0.8}
        onPress={onDiscoverPress}
      >
        <SolidText style={styles.discoverText}>{discoverLabel}</SolidText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(SettingsPremiumCard);
