import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppRoutes from '../RouteKeys/appRoutes';
import Splash from '../../features/onboard/screens/Splash/Splash';
import Welcome from '../../features/onboard/screens/Welcome/Welcome';
import GetStarted from '../../features/onboard/screens/GetStarted/GetStarted';
import HearAboutUs from '../../features/onboard/screens/HearAboutUs/HearAboutUs';
import BringYouHere from '../../features/onboard/screens/BringYouHere/BringYouHere';
import FeelingsLately from '../../features/onboard/screens/FeelingsLately/FeelingsLately';
import FeelMore from '../../features/onboard/screens/FeelMore/FeelMore';
import TimeCommitment from '../../features/onboard/screens/TimeCommitment/TimeCommitment';
import ReadyToStart from '../../features/onboard/screens/ReadyToStart/ReadyToStart';
import RightPlace from '../../features/onboard/screens/RightPlace/RightPlace';
import PrivacyMatters from '../../features/onboard/screens/PrivacyMatters/PrivacyMatters';
import Warning from '../../features/onboard/screens/Warning/Warning';
import CreatingSpace from '../../features/onboard/screens/CreatingSpace/CreatingSpace';
import Terms from '../../features/common/screens/Terms/Terms';
import PrivacyPolicy from '../../features/common/screens/PrivacyPolicy/PrivacyPolicy';

export default function AuthStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AppRoutes.Splash} component={Splash} />
      <Stack.Screen name={AppRoutes.Welcome} component={Welcome} />
      <Stack.Screen name={AppRoutes.GetStarted} component={GetStarted} />
      <Stack.Screen name={AppRoutes.HearAboutUs} component={HearAboutUs} />
      <Stack.Screen name={AppRoutes.BringYouHere} component={BringYouHere} />
      <Stack.Screen
        name={AppRoutes.FeelingsLately}
        component={FeelingsLately}
      />
      <Stack.Screen name={AppRoutes.FeelMore} component={FeelMore} />
      <Stack.Screen
        name={AppRoutes.TimeCommitment}
        component={TimeCommitment}
      />
      <Stack.Screen name={AppRoutes.ReadyToStart} component={ReadyToStart} />
      <Stack.Screen name={AppRoutes.RightPlace} component={RightPlace} />
      <Stack.Screen
        name={AppRoutes.PrivacyMatters}
        component={PrivacyMatters}
      />
      <Stack.Screen name={AppRoutes.Warning} component={Warning} />
      <Stack.Screen name={AppRoutes.CreatingSpace} component={CreatingSpace} />
      <Stack.Screen name={AppRoutes.Terms} component={Terms} />
      <Stack.Screen name={AppRoutes.PrivacyPolicy} component={PrivacyPolicy} />
    </Stack.Navigator>
  );
}
