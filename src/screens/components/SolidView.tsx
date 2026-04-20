import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';

interface SolidViewProps {
  viewStyle?: object;
  isScrollEnabled?: boolean;
  view: React.ReactNode;
  backgroundImage?: any
}

const SolidView: React.FC<SolidViewProps> = ({ viewStyle, view, isScrollEnabled, backgroundImage }) => {
  const { colors } = useTheme();
  const styles = style(colors)
  return (
    <View style={[styles.parent, viewStyle]}>
      {backgroundImage && <Image source={backgroundImage} style={styles.absolutePosition} />}
      {isScrollEnabled ?
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            {view}
          </SafeAreaView>
        </ScrollView>
        :
        <SafeAreaView style={{ flex: 1}}>
          {view}
        </SafeAreaView>
      }
    </View>
  );
}

const style = (colors: any) => StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.background
  },
  absolutePosition: {
    flex:1,position: 'absolute', left: 0, right: 0, top: 0, bottom: 0
  }
});

export default SolidView;
