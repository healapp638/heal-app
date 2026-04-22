import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppRoutes from '../RouteKeys/appRoutes';
import Offer from '../../features/premium/screens/Offer/Offer';
import Reminder from '../../features/premium/screens/Reminder/Reminder';
import Premium from '../../features/premium/screens/Premium/Premium';
import Terms from '../../features/common/screens/Terms/Terms';
import PrivacyPolicy from '../../features/common/screens/PrivacyPolicy/PrivacyPolicy';
import TabNavigator from '../TabNavigator/TabNavigator';
import DailyStreak from '../../features/Home/screens/DailyStreak/DailyStreak';
import DailyQuote from '../../features/Home/screens/DailyQuote/DailyQuote';
import ProgressTracker from '../../features/Home/screens/ProgressTracker/ProgressTracker';
import ThemeMixes from '../../features/Home/screens/ThemeMixes/ThemeMixes';
import ThemeSeeAll from '../../features/Home/screens/ThemeSeeAll/ThemeSeeAll';
import ThemeDetail from '../../features/Home/screens/ThemeDetail/ThemeDetail';
import HealyChat from '../../features/Home/screens/HealyChat/HealyChat';

export default function NonAuthStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name={AppRoutes.Offer} component={Offer} />
      <Stack.Screen name={AppRoutes.Reminder} component={Reminder} />
      <Stack.Screen name={AppRoutes.Premium} component={Premium} />
      <Stack.Screen name={AppRoutes.Terms} component={Terms} />
      <Stack.Screen name={AppRoutes.PrivacyPolicy} component={PrivacyPolicy} />
      <Stack.Screen name={AppRoutes.BottomTab} component={TabNavigator} />
      <Stack.Screen name={AppRoutes.DailyStreak} component={DailyStreak} />
      <Stack.Screen name={AppRoutes.DailyQuote} component={DailyQuote} />
      <Stack.Screen
        name={AppRoutes.ProgressTracker}
        component={ProgressTracker}
      />
      <Stack.Screen name={AppRoutes.ThemeMixes} component={ThemeMixes} />
      <Stack.Screen name={AppRoutes.ThemeSeeAll} component={ThemeSeeAll} />
      <Stack.Screen name={AppRoutes.ThemeDetail} component={ThemeDetail} />
      <Stack.Screen name={AppRoutes.HealyChat} component={HealyChat} />
    </Stack.Navigator>
  );
}
