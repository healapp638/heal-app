import React, { useEffect } from "react";
import { View, StyleSheet, Image, useColorScheme } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useTheme } from "@react-navigation/native";
import AppRoutes from "../../routes/RouteKeys/appRoutes";

const Splash: React.FC = () => {
  const auth = useSelector((state: any) => state.userData.auth);
  const { colors, images } = useTheme();
  const navigation: any = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      auth
        ? navigation.replace(AppRoutes.NonAuthStack)
        : navigation.replace(AppRoutes.Welcome);
    }, 3000);
  }, []);

  return (
    <View style={[style.parent, { backgroundColor: colors.background }]}>
      <Image source={images.logo} style={style.image} />
    </View>
  );
}
const style = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: "80%",
    resizeMode: "contain",
    alignSelf: "center",
  },
});
export default Splash;
