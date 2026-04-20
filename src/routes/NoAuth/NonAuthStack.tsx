import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/nonAuth/Home";
import AppRoutes from "../RouteKeys/appRoutes";

export default function NonAuthStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AppRoutes.Home} component={Home} />
    </Stack.Navigator>
  );
}
