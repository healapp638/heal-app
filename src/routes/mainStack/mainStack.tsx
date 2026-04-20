import React, { useContext, useEffect, useRef, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppRoutes from "../RouteKeys/appRoutes";
import AuthStack from "../auth/AuthStack";
import NonAuthStack from "../NoAuth/NonAuthStack";
import { LocalizationContext } from "../../localization/localization";
import { strings } from "../../constants/variables";
import Loader from "../../screens/modals/Loader";
import { useSelector } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import {
  Text,
  Animated,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ Use this SafeAreaView

export default function MainStack() {
  const Stack = createNativeStackNavigator();
  const { initializeAppLanguage, setAppLanguage } = useContext(LocalizationContext);
  const loading = useSelector((state: any) => state.tempData.loader);
  const netInfo = useNetInfo();

  const [showBanner, setShowBanner] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current; // slightly more height to fully hide
  const isFirstLoad = useRef(true);
  const prevConnection = useRef<boolean | null>(null);

  useEffect(() => {
    setAppLanguage(strings.english);
    initializeAppLanguage();
  }, []);

  useEffect(() => {
    if (netInfo.isConnected != null) {
      const connected = netInfo.isConnected;

      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        prevConnection.current = connected;
        setIsConnected(connected);
        return;
      }

      if (prevConnection.current !== connected) {
        setIsConnected(connected);
        setShowBanner(true);

        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (connected) {
            setTimeout(() => {
              Animated.timing(slideAnim, {
                toValue: 20,
                duration: 300,
                useNativeDriver: true,
              }).start(() => setShowBanner(false));
            }, 1000);
          }
        });

        prevConnection.current = connected;
      }
    }
  }, [netInfo.isConnected]);

  return (
    <>
      {showBanner && (
        <SafeAreaView edges={['top']} style={{ zIndex: 20, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Animated.View
            style={[
              styles.banner,
              {
                backgroundColor: isConnected ? "green" : "red",
                transform: [{ translateY: slideAnim }],
              },
            ]}>
            <Text style={styles.bannerText}>
              {isConnected ? "Back online" : "No Internet Connection"}
            </Text>
          </Animated.View>
        </SafeAreaView>
      )}

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={AppRoutes.AuthStack} component={AuthStack} />
        <Stack.Screen name={AppRoutes.NonAuthStack} component={NonAuthStack} />
      </Stack.Navigator>
      {loading && <Loader />}
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bannerText: {
    color: "white",
    fontWeight: "500",
  },
});
