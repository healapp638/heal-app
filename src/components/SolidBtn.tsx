import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { triggerHaptic } from '../hooks/useHaptic';
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
interface SolidBtnProps {
  btnStyle?: ViewStyle;
  txtStyle?: TextStyle;
  titleTxt: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  img?: any;
  imgTintColor?: any;
  maxFontScale?: any;
}
const SolidBtn: React.FC<SolidBtnProps> = ({
  btnStyle,
  txtStyle,
  titleTxt,
  onPress,
  isLoading,
  disabled = false,
  img,
  imgTintColor,
  maxFontScale,
}) => {
  const { colors } = useTheme();
  const styles = style(colors);
  return (
    <TouchableOpacity
      onPress={() => {
        //
        Keyboard.dismiss();
        ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
        onPress();
      }}
      disabled={disabled || isLoading}
      style={[styles.btn, btnStyle, disabled && styles.disabled]}
    >
      {isLoading && <ActivityIndicator color={colors.primary} />}
      {img && (
        <Image
          resizeMode="contain"
          tintColor={imgTintColor}
          source={img}
          style={{
            width: 24,
            height: 24,
            marginHorizontal: 8,
          }}
        />
      )}
      {!isLoading && (
        <SolidText
          maxFontScale={maxFontScale ?? 1.3}
          style={[styles.btntxt, txtStyle]}
        >
          {titleTxt}
        </SolidText>
      )}
    </TouchableOpacity>
  );
};
const style = (colors: any) =>
  StyleSheet.create({
    btn: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%',
      alignSelf: 'center',
      height: Platform.OS == 'ios' ? 54 : 50,
      marginTop: 20,
      marginBottom: 10,
      borderRadius: 100,
      backgroundColor: colors.brown,
      flexDirection: 'row',
    },
    btntxt: {
      fontSize: AppUtils.fontSize(16),
      color: 'white',
      fontFamily: AppFonts.semiBold,
      includeFontPadding: false,
    },
    disabled: {
      backgroundColor: '#B0B0B0',
    },
  });
export default SolidBtn;
