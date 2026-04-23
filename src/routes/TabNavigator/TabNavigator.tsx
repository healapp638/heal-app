import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppRoutes from '../RouteKeys/appRoutes';
import CustomTabBar from './CustomTabBar';
import { LocalizationContext } from '../../localization/localization';
import Home from '../../features/Home/screens/Home/Home';
import Challenges from '../../features/Challenges/screens/Challenges/Challenges';

import Settings from '../../features/settings/screens/Settings/Settings';
import Modules from '../../features/Modules/screens/Modules/Modules';
import Journal from '../../features/Journal/screens/Journal/Journal';

// Placeholder screens (will be replaced with real imports)

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { localization } = useContext(LocalizationContext) as any;

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={AppRoutes.Home}
        component={Home}
        options={{ tabBarLabel: localization.appkeys?.tabHome || 'Home' }}
      />
      <Tab.Screen
        name={AppRoutes.Challenges}
        component={Challenges}
        options={{
          tabBarLabel: localization.appkeys?.tabChallenges || 'Challenges',
        }}
      />
      <Tab.Screen
        name={AppRoutes.Modules}
        component={Modules}
        options={{ tabBarLabel: localization.appkeys?.tabModules || 'Modules' }}
      />
      <Tab.Screen
        name={AppRoutes.Journal}
        component={Journal}
        options={{ tabBarLabel: localization.appkeys?.tabJournal || 'Journal' }}
      />
      <Tab.Screen
        name={AppRoutes.Settings}
        component={Settings}
        options={{
          tabBarLabel: localization.appkeys?.tabSettings || 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
