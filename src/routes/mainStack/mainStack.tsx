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
import { Text, Animated, StyleSheet, Linking, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ Use this SafeAreaView
import { useNavigation } from '@react-navigation/native';
import usePostApi from '../../hooks/usePostApi';
import { endpoints } from '../../api/Services/endpoints';
import { setLoader } from '../../redux/Reducers/tempData';
import AppUtils from '../../utils/appUtils';
import {
  setEmail,
  setOnboardingAnswer,
  SetAppLanguage,
  setUser,
  setToken,
  setRefreshToken,
  setAuth,
  getUserDetail,
} from '../../redux/Reducers/userData';

import {
  clearTokensFromKeychain,
  getTokensFromKeychain,
} from '../../utils/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const dispatch = useDispatch();
  const { initializeAppLanguage, setAppLanguage } =
    useContext(LocalizationContext);
  const loading = useSelector((state: any) => state.tempData.loader);
  const { mutate: loginMagicLink } = usePostApi();
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  const [showBanner, setShowBanner] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current; // slightly more height to fully hide
  const isFirstLoad = useRef(true);
  const prevConnection = useRef<boolean | null>(null);
  const lastProcessedUrl = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeAppLanguage();
    const bootstrapAsync = async () => {
      try {
        const hasRunBefore = await AsyncStorage.getItem('has_run_before');
        if (!hasRunBefore) {
          await clearTokensFromKeychain();
          await AsyncStorage.setItem('has_run_before', 'true');
        }

        const tokens = await getTokensFromKeychain();
        if (tokens) {
          dispatch(setToken(tokens.accessToken));
          dispatch(setRefreshToken(tokens.refreshToken));
          dispatch(setAuth(true));
          dispatch(getUserDetail(false) as any);
        }
      } catch (e) {
        console.log('Error loading tokens from keychain:', e);
      } finally {
        setIsReady(true);
      }
    };
    bootstrapAsync();
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

  // Use refs for values needed inside handleUrl to avoid stale closures
  const loginMagicLinkRef = useRef(loginMagicLink);
  const dispatchRef = useRef(dispatch);
  const navigationRef = useRef(navigation);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    loginMagicLinkRef.current = loginMagicLink;
  }, [loginMagicLink]);

  useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);

  useEffect(() => {
    navigationRef.current = navigation;
  }, [navigation]);

  useEffect(() => {
    // Handle deep link
    const handleUrl = (url: string) => {
      if (!url) return;

      // Deduplicate: skip if same URL was processed recently (within 5 seconds)
      if (lastProcessedUrl.current === url) {
        console.log('Deep link already processed:', url);
        return;
      }
      lastProcessedUrl.current = url;
      AppUtils.showLog('Deep link received:', url);

      // Extract code dynamically (part after 'link/' and before '?')
      let code = '';
      const linkIndex = url.indexOf('/link/');
      if (linkIndex !== -1) {
        const afterLink = url.substring(linkIndex + 6);
        code = afterLink.split('?')[0];
      }
      console.log('Extracted code:', code);

      // Extract query parameters safely
      const params: { [key: string]: string } = {};
      const queryString = url.split('?')[1];
      if (queryString) {
        const pairs = queryString.split('&');
        pairs.forEach(pair => {
          const [key, value] = pair.split('=');
          if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
          }
        });
      }

      AppUtils.showLog('Parsed query params:', params);

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

      // Use refs to get fresh dispatch/navigation/mutate
      const currentDispatch = dispatchRef.current;
      const currentNavigation = navigationRef.current;
      const currentLoginMagicLink = loginMagicLinkRef.current;

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
          currentDispatch(SetAppLanguage(mappedLanguage));
          setAppLanguage(mappedLanguage);
        }
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
          currentDispatch(setOnboardingAnswer({ key, value }));
        }
      });

      // Handle magic link login if email exists
      if (email) {
        currentDispatch(setEmail(email));

        currentLoginMagicLink(
          {
            endpoint: endpoints.magicLinkLogin,
            data: {
              code: code,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              language: language || 'en',
              fullName: fullName || '',
              goalStartWith: goalStartWith || '',
              timeYouCommit: timeYouCommit || '',
              stopFeelBetter: stopFeelBetter || '',
              helpFeelBetter: helpFeelBetter || '',
              likeToFellMore: likeToFellMore || '',
              feelThatWay: feelThatWay || '',
              howFellingLately: howFellingLately || '',
              hearAboutUs: hearAboutUs || '',
              email: email.trim().toLowerCase(),
            },
          },
          {
            onSuccess: async (response: any) => {
              currentDispatch(setLoader(false));
              currentDispatch(setUser(response?.data));
              currentDispatch(setToken(response?.data?.access_token));
              currentDispatch(setRefreshToken(response?.data?.refresh_token));
              currentDispatch(setAuth(true));
              currentDispatch(getUserDetail() as any);
              currentDispatch(setEmail(email));

              if (response?.data?.is_onboarding === false) {
                // Navigate to onboard flow starting from Welcome screen
                currentNavigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: AppRoutes.AuthStack,
                      params: {
                        screen: AppRoutes.HearAboutUs,
                        params: { from: 'link' },
                      },
                    } as never,
                  ],
                });
              } else {
                if (response?.data?.user_subscription?.is_subscribed == 1) {
                  currentNavigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: AppRoutes.NonAuthStack,
                        params: {
                          screen: AppRoutes.BottomTab,
                        },
                      } as never,
                    ],
                  });
                } else {
                  currentNavigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: AppRoutes.NonAuthStack,
                        params: {
                          screen: AppRoutes.Offer,
                        },
                      } as never,
                    ],
                  });
                }
                // Navigate/Reset to NonAuthStack Offer screen
              }
            },
            onError: (error: any) => {
              currentDispatch(setLoader(false));
              console.log('Magic link login error:', error);
              AppUtils.showToast(error.message || 'Magic link login failed');

              currentNavigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.AuthStack,
                    params: {
                      screen: AppRoutes.Welcome,
                    },
                  } as never,
                ],
              });
            },
          },
        );
      }
    };

    // Cold start: only fires once when the app is launched from a killed state
    Linking.getInitialURL().then(url => {
      if (url) {
        handleUrl(url);
      }
    });

    // Runtime deep links: fires when the app is already running (foreground or background)
    // On iOS, this is the ONLY reliable way to get the URL when app resumes from background
    const subscription = Linking.addEventListener('url', ({ url }) => {
      // Clear lastProcessedUrl so the new link always gets processed
      lastProcessedUrl.current = null;
      handleUrl(url);
    });

    // NOTE: We intentionally do NOT call Linking.getInitialURL() inside AppState listener.
    // On iOS, getInitialURL() always returns the URL that LAUNCHED the app (cold start),
    // NOT the URL that brought it from background. This was causing stale/previous link
    // codes to be sent to the API on iOS. The Linking 'url' event above handles
    // background-to-foreground links correctly.

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  if (!isReady) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#F4EEE2' }} />;
  }

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
