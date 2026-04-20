import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../../screens/auth/Splash";
import Welcome from "../../screens/auth/Welcome";
import AppRoutes from "../RouteKeys/appRoutes";

export default function AuthStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AppRoutes.Splash} component={Splash} />
      <Stack.Screen name={AppRoutes.Welcome} component={Welcome} />
    </Stack.Navigator>
  );
}
