import React from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";

interface SolidInputProps {
  viewStyle?: object;
  textInputStyle?: object;
  placeholder?: string;
  leftImg?:any;
  rightImg?:any;
  isSecure?:boolean;
  onRightPress?:() => void;
}

const SolidInput: React.FC<SolidInputProps> = ({ viewStyle, placeholder, textInputStyle,leftImg,rightImg,isSecure,onRightPress}) => {
  const { colors } = useTheme();
  const styles = style(colors)
  return (
    <View style={[styles.parent, viewStyle]}>
      {leftImg && <Image source={leftImg} style={styles.imgStyle}/>}
      <TextInput secureTextEntry={isSecure} placeholderTextColor={'grey'} placeholder={placeholder} style={[styles.textInput, textInputStyle]} />
      {rightImg && <Pressable style={{alignSelf:'center'}} onPress={onRightPress}><Image source={rightImg} style={styles.imgStyle}/></Pressable>}
    </View>
  );
}

const style = (colors: any) => StyleSheet.create({
  parent: {
    width: '100%', height: 48, backgroundColor: colors.text, borderRadius: 25, overflow: 'hidden', paddingHorizontal: 20, flexDirection: 'row'
  },
  absolutePosition: {
    flex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0
  },
  textInput: {
    flex: 1, color: colors.background
  },
  imgStyle:{
    width:24,height:24,alignSelf:'center'
  }
});

export default SolidInput;
