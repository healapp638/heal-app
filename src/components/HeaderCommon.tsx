import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppUtils from '../utils/appUtils';
import AppFonts from '../constants/fonts';
import SolidText from './SolidText';

interface HeaderCommonProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const HeaderCommon: React.FC<HeaderCommonProps> = ({
  title,
  showBack = true,
  onBackPress,
  rightComponent,
}) => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sideContainer}>
        {showBack && (
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Image
              source={images.back}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        {title && (
          <SolidText style={styles.title} numberOfLines={1}>
            {title}
          </SolidText>
        )}
      </View>

      <View style={styles.sideContainer}>
        {rightComponent ? (
          rightComponent
        ) : (
          <View style={styles.rightPlaceholder} />
        )}
      </View>
    </View>
  );
};

export default HeaderCommon;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: Platform.OS === 'ios' ? 0 : 8,
    height: 50,
    marginBottom: 20,
  },
  sideContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: Platform.OS == 'ios' ? 20 : 18,
    height: Platform.OS == 'ios' ? 20 : 18,
  },
  title: {
    fontFamily: AppFonts.medium,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    includeFontPadding: false,
  },
  rightPlaceholder: {
    width: 40,
  },
});
