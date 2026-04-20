import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useContext, useEffect} from "react";
import { View, StyleSheet, Text } from "react-native";
import { useDispatch } from "react-redux";
import { LocalizationContext } from "../../localization/localization";
import { setAuth } from "../../redux/Reducers/userData";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import SolidBtn from "../components/SolidBtn";
import SolidView from "../components/SolidView";
import AppUtils from "../../utils/appUtils";
import SolidText from "../components/SolidText";

const Welcome: React.FC = () => {
  const { colors } = useTheme();
  const { localization } = useContext(LocalizationContext);
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  return (
    <SolidView
      view={
        <View style={{ flex: 1, justifyContent: "center" }}>

          <SolidText
          
            style={[style.titleText, { color: colors.text }]}
          >
            {localization.appkeys.welcome_solid}
          </SolidText>
          
          <SolidBtn
            onPress={() => {
             dispatch(setAuth(true));
              navigation.navigate(AppRoutes.NonAuthStack);
            }}
            titleTxt={localization.appkeys.go_home}
          />
        </View>
      }
    />
  );
}

const style = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 25,
  },
});
export default Welcome;
