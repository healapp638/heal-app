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
import AccessScreen from '../../features/auth/screens/AccessScreen/AccessScreen';
import SignIn from '../../features/auth/screens/SignIn/SignIn';
import SignUp from '../../features/auth/screens/SignUp/SignUp';
import Verification from '../../features/auth/screens/Verification/Verification';
import ForgotPassword from '../../features/auth/screens/ForgotPassword/ForgotPassword';
import ResetPassword from '../../features/auth/screens/ResetPassword/ResetPassword';
import SelectLanguage from '../../features/auth/screens/SelectLanguage/SelectLanguage';

export default function AuthStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
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
      <Stack.Screen name={AppRoutes.AccessScreen} component={AccessScreen} />
      <Stack.Screen name={AppRoutes.SignIn} component={SignIn} />
      <Stack.Screen name={AppRoutes.SignUp} component={SignUp} />
      <Stack.Screen name={AppRoutes.Verification} component={Verification} />
      <Stack.Screen
        name={AppRoutes.ForgotPassword}
        component={ForgotPassword}
      />
      <Stack.Screen name={AppRoutes.ResetPassword} component={ResetPassword} />
      <Stack.Screen
        name={AppRoutes.SelectLanguage}
        component={SelectLanguage}
      />
    </Stack.Navigator>
  );
}
