import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import SolidView from "../components/SolidView";
import SolidText from "../components/SolidText";

interface HomeProps {
  navigation: any;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { colors, images } = useTheme();

  return (
    <SolidView
      viewStyle={styles.parent}
      view={
        <SolidText variant='bold' style={{alignSelf:'center'}}>
          {"Welcome Home\nSolidAppMaker"}
        </SolidText>
      }
    />
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: "center"
  }
});

export default Home;
