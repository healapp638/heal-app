import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppFonts from '../constants/fonts';
import SolidText from './SolidText';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { triggerHaptic } from '../hooks/useHaptic';
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
interface HeaderCommonProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  rightIcon?: any;
  onRightPress?: () => void;
  tintColor?: string;
  viewStyle?: any;
}
const HeaderCommon: React.FC<HeaderCommonProps> = ({
  title,
  showBack = true,
  onBackPress,
  rightComponent,
  rightIcon,
  onRightPress,
  tintColor,
  viewStyle,
}) => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const styles = useStyles(colors);
  const activeTintColor = tintColor || colors.brown;
  const handleBack = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', options);
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };
  const handleRightPress = () => {
    if (onRightPress) {
      onRightPress();
    }
  };
  return (
    <View
      style={{
        ...styles.container,
        ...viewStyle,
      }}
    >
      <View style={styles.sideContainer}>
        {showBack && (
          <TouchableOpacity
            hitSlop={10}
            onPress={(...args: any) => {
              return (handleBack as any)(...args);
            }}
            activeOpacity={0.7}
          >
            <Image
              source={images.back}
              style={[
                styles.backIcon,
                {
                  tintColor: activeTintColor,
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        {title && (
          <SolidText
            style={[
              styles.title,
              {
                color: activeTintColor,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </SolidText>
        )}
      </View>

      <View
        style={{
          ...styles.sideContainer,
          alignItems: 'flex-end',
        }}
      >
        {rightComponent ? (
          rightComponent
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={(...args: any) => {
              triggerHaptic('impactMedium');
              return (handleRightPress as any)(...args);
            }}
            activeOpacity={0.7}
          >
            <Image
              source={rightIcon}
              tintColor={activeTintColor}
              style={{
                height: 21,
                width: 21,
              }} // Reusing same icon size constraints
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.rightPlaceholder} />
        )}
      </View>
    </View>
  );
};
export default HeaderCommon;
const useStyles = (colors: any) =>
  StyleSheet.create({
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
      width: 16,
      height: 16,
    },
    title: {
      fontFamily: AppFonts.medium,
      fontSize: 16,
      color: colors.brown,
      textAlign: 'center',
      includeFontPadding: false,
    },
    rightPlaceholder: {
      width: 40,
    },
  });
