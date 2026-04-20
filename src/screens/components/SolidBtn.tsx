import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Image,
} from "react-native";
import SolidText from "./SolidText";

interface SolidBtnProps {
  btnStyle?: ViewStyle;
  txtStyle?: TextStyle;
  titleTxt: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  img?: any,
  imgTintColor?: any
}

const SolidBtn: React.FC<SolidBtnProps> = ({
  btnStyle,
  txtStyle,
  titleTxt,
  onPress,
  isLoading,
  disabled = false,
  img,
  imgTintColor
}) => {
  const { colors } = useTheme();
  const styles = style(colors)
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, btnStyle, disabled && styles.disabled]}>
      {isLoading && <ActivityIndicator />}
      {img && <Image tintColor={imgTintColor} source={img} style={{ width: 24, height: 24, marginHorizontal: 8 }} />}
      {!isLoading && (
        <SolidText style={[styles.btntxt, txtStyle]}>
          {titleTxt}
        </SolidText>
      )}
    </TouchableOpacity>
  );
};

const style = (colors: any) => StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: colors.primary, flexDirection: 'row'
  },
  btntxt: {
    fontSize: 16,
    color: "white",
  },
  disabled: {
    backgroundColor: '#B0B0B0',
  },
});

export default SolidBtn;
