import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppRoutes from '../RouteKeys/appRoutes';
import Offer from '../../features/premium/screens/Offer/Offer';
import Reminder from '../../features/premium/screens/Reminder/Reminder';
import Premium from '../../features/premium/screens/Premium/Premium';

export default function NonAuthStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name={AppRoutes.Offer} component={Offer} />
      <Stack.Screen name={AppRoutes.Reminder} component={Reminder} />
      <Stack.Screen name={AppRoutes.Premium} component={Premium} />
    </Stack.Navigator>
  );
}
