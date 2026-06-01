import {
  Image,
  Pressable,
  Platform,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import SolidText from './SolidText';
import { triggerHaptic } from '../hooks/useHaptic';
interface SolidInputProps {
  label?: string;
  viewStyle?: ViewStyle;
  textInputStyle?: TextStyle;
  placeholder?: string;
  leftImg?: any;
  rightImg?: any;
  isSecure?: boolean;
  onRightPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  rightImgTintColor?: string;
  editable?: boolean;
  pointerEvents?: 'none' | 'auto' | 'box-none' | 'box-only';
  onInfoPress?: () => void;
  mainStyle?: ViewStyle;
  maxLength?: any;
  labelRow?: ViewStyle;
  autoFocus?: boolean;
}
const SolidInput: React.FC<SolidInputProps> = ({
  label,
  viewStyle,
  placeholder,
  textInputStyle,
  leftImg,
  rightImg,
  isSecure,
  onRightPress,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  editable,
  pointerEvents,
  onInfoPress,
  rightImgTintColor,
  mainStyle,
  maxLength,
  autoFocus,
}) => {
  const { colors, images } = useTheme() as any;
  const styles = style(colors);
  return (
    <View style={[styles.mainContainer, mainStyle]}>
      <View style={styles.labelRow}>
        {label && <SolidText style={styles.label}>{label}</SolidText>}
        {onInfoPress && (
          <TouchableOpacity
            onPress={(...args: any) => {
              return (onInfoPress as any)(...args);
            }}
            style={styles.infoButton}
          >
            <Image
              source={images.info}
              style={[
                styles.infoIcon,
                {
                  tintColor: colors.primary,
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.parent, viewStyle]} pointerEvents={pointerEvents}>
        {leftImg && (
          <Image
            source={leftImg}
            style={styles.imgStyle}
            resizeMode="contain"
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          placeholderTextColor="#999"
          placeholder={placeholder}
          style={[styles.textInput, textInputStyle]}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          maxFontSizeMultiplier={1.4}
          maxLength={maxLength}
          autoFocus={autoFocus}
        />
        {rightImg && (
          <Pressable
            style={styles.rightIconWrapper}
            onPress={(...args: any) => {
              return (onRightPress as any)(...args);
            }}
          >
            <Image
              source={rightImg}
              style={[
                styles.imgStyle,
                rightImgTintColor
                  ? {
                      tintColor: rightImgTintColor,
                    }
                  : {},
              ]}
              resizeMode="contain"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};
const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      marginBottom: 20,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(13),
      color: colors.brown,
      marginBottom: Platform.OS == 'ios' ? 8 : 4,
      marginLeft: 5,
      includeFontPadding: false,
    },
    infoButton: {
      marginLeft: 6,
      marginBottom: Platform.OS == 'ios' ? 8 : 4,
    },
    infoIcon: {
      width: 14,
      height: 14,
    },
    parent: {
      width: '100%',
      height: Platform.OS == 'ios' ? 52 : 50,
      backgroundColor: colors.white,
      borderRadius: 12,
      overflow: 'hidden',
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    textInput: {
      flex: 1,
      color: colors.brown,
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(15),
      height: '100%',
      includeFontPadding: false,
    },
    imgStyle: {
      width: Platform.OS == 'ios' ? 20 : 18,
      height: Platform.OS == 'ios' ? 20 : 18,
    },
    rightIconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
  });
export default SolidInput;
