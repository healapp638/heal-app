import React, { useContext, useEffect, useRef, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppRoutes from '../RouteKeys/appRoutes';
import AuthStack from '../auth/AuthStack';
import NonAuthStack from '../NoAuth/NonAuthStack';
import { LocalizationContext } from '../../localization/localization';
import { strings } from '../../constants/variables';
import Loader from '../../modals/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useNetInfo } from '@react-native-community/netinfo';
import { Text, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ Use this SafeAreaView
import { Linking } from 'react-native';
import {
  setEmail,
  setOnboardingAnswer,
  SetAppLanguage,
} from '../../redux/Reducers/userData';

export default function MainStack() {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  const { initializeAppLanguage, setAppLanguage } =
    useContext(LocalizationContext);
  const loading = useSelector((state: any) => state.tempData.loader);
  const netInfo = useNetInfo();

  const [showBanner, setShowBanner] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current; // slightly more height to fully hide
  const isFirstLoad = useRef(true);
  const prevConnection = useRef<boolean | null>(null);

  useEffect(() => {
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



  useEffect(() => {
    // Handle deep link
    const handleUrl = (url: string) => {
      console.log('Deep link received:', url);

      // Extract query parameters safely
      const params: { [key: string]: string } = {};
      const queryString = url.split('?')[1];
      if (queryString) {
        const pairs = queryString.split('&');
        pairs.forEach((pair) => {
          const [key, value] = pair.split('=');
          if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
          }
        });
      }

      console.log('Parsed query params:', params);

      const {
        language,
        email,
        fullName,
        goalStartWith,
        timeYouCommit,
        stopFeelBetter,
        helpFeelBetter,
        likeToFellMore,
        feelThatWay,
        howFellingLately,
        hearAboutUs,
        ref,
      } = params;

      if (ref) {
        console.log('Referral:', ref);
      }

      // Handle language mapping and setting
      if (language) {
        const languageMap: { [key: string]: string } = {
          en: 'English',
          es: 'Spanish',
          fr: 'French',
          de: 'German',
          ru: 'Russian',
          pt: 'Portuguese',
          it: 'Italian',
        };
        const mappedLanguage = languageMap[language.toLowerCase()];
        if (mappedLanguage) {
          dispatch(SetAppLanguage(mappedLanguage));
          setAppLanguage(mappedLanguage);
        }
      }

      // Handle email setting
      if (email) {
        dispatch(setEmail(email));
      }

      // Handle onboarding answers
      const answersMap: { [key: string]: string | undefined } = {
        fullName,
        goalStartWith,
        timeYouCommit,
        stopFeelBetter,
        helpFeelBetter,
        likeToFellMore,
        feelThatWay,
        howFellingLately,
        hearAboutUs,
      };

      Object.entries(answersMap).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          dispatch(setOnboardingAnswer({ key, value }));
        }
      });
    };

    // Cold start
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      }
    });

    // Runtime deep links
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, []);




  return (
    <>
      {showBanner && (
        <SafeAreaView
          edges={['top']}
          style={{
            zIndex: 20,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Animated.View
            style={[
              styles.banner,
              {
                backgroundColor: isConnected ? 'green' : 'red',
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.bannerText}>
              {isConnected ? 'Back online' : 'No Internet Connection'}
            </Text>
          </Animated.View>
        </SafeAreaView>
      )}

      <Stack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name={AppRoutes.AuthStack} component={AuthStack} />
        <Stack.Screen name={AppRoutes.NonAuthStack} component={NonAuthStack} />
      </Stack.Navigator>
      {loading && <Loader />}
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bannerText: {
    color: 'white',
    fontWeight: '500',
  },
});
