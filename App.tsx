import React, { useEffect, useState } from 'react';
import { LogBox, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/Store/store';
import { LightTheme, DarkTheme } from './src/constants/colors';
import MainStack from './src/routes/mainStack/mainStack';
import AppUtils from './src/utils/appUtils';
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import UpdatePopup from './src/modals/UpdatePopup';
import { PersistGate } from 'redux-persist/integration/react';
import { LocalizationProvider } from './src/localization/localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SetAppLanguage } from './src/redux/Reducers/userData';
import { strings } from './src/constants/variables';
import { ToastProvider } from './src/utils/ToastManager';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { navigationRef } from './src/utils/navigationRef';
import { SubscriptionProvider } from './src/hooks/useSubscription';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LogRocket from '@logrocket/react-native';
const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const theme = useColorScheme();
  const isDarkMode = useColorScheme() === 'dark';
  LogBox.ignoreLogs(['[RevenueCat]']);
  useEffect(() => {
    notifee.requestPermission();
    AppUtils.disableFontScale();
    checkUpdate();
    getLanguage();
    if (!__DEV__) {
      LogRocket.init('gh27g7/heal');
    }
    const unsubscribe = messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);
    return unsubscribe;
  }, []);

  const getLanguage = async () => {
    try {
      const value = await AsyncStorage.getItem(strings.appLanguage);
      if (value !== null) {
        store.dispatch(SetAppLanguage(value));
      }
    } catch (e) {
      console.log('Error loading language', e);
    }
  };

  const checkUpdate = async () => {
    let isNew = await AppUtils.checkAppVersion();
    setIsUpdateAvailable(isNew);
  };

  async function onMessageReceived(message: any) {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH,
    });
    notifee.displayNotification({
      title: message?.notification?.title,
      body: message?.notification?.body,
      android: {
        channelId,
      },
      data: message?.data,
      ios: {
        sound: 'default',
      },
    });
  }

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <UpdatePopup
          onBackDropPress={() => setIsUpdateAvailable(false)}
          isVisible={isUpdateAvailable}
        />

        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SubscriptionProvider>
              <LocalizationProvider>
                <QueryClientProvider client={queryClient}>
                  <NavigationContainer
                    ref={navigationRef}
                    theme={theme == 'dark' ? DarkTheme : LightTheme}
                  >
                    <ToastProvider>
                      <MainStack />
                    </ToastProvider>
                  </NavigationContainer>
                </QueryClientProvider>
              </LocalizationProvider>
            </SubscriptionProvider>
          </PersistGate>
        </Provider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

export default App;
