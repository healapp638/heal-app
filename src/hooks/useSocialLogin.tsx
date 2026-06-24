import React, { useContext } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Alert, Platform } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import useBiometric from './useBiometric';
import usePostApi from './usePostApi';
import { endpoints } from '../api/Services/endpoints';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAuth,
  setToken,
  setRefreshToken,
  setUser,
  getUserDetail,
  setBiometric,
  setLastLoginType,
  setSocialEmail,
} from '../redux/Reducers/userData';
import { useNavigation } from '@react-navigation/native';
import AppRoutes from '../routes/RouteKeys/appRoutes';
import AppUtils from '../utils/appUtils';
import { setLoader } from '../redux/Reducers/tempData';
import { LocalizationContext } from '../localization/localization';

const useSocialLogin = () => {
  const { mutate: socialLoginMutate, isPending } = usePostApi();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const onboardingAnswers = useSelector(
    (state: any) => state.userData?.onboarding?.answers,
  );
  const { handleBiometricAuth, biometric } = useBiometric();

  const handleSocialLogin = (
    uID: string,
    email: string,
    name: string,
    source: 'google' | 'apple',
  ) => {
    const payload = {
      login_source: source,
      social_auth: uID,
      email: email,
      name: onboardingAnswers?.fullName || name || '',
      os_type: Platform.OS,
      language: AppUtils.getLanguageCode(appLanguage),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      fullName: onboardingAnswers?.fullName || '',
      goalStartWith: onboardingAnswers?.goalStartWith || '',
      timeYouCommit: onboardingAnswers?.timeYouCommit || '',
      stopFeelBetter: onboardingAnswers?.stopFeelBetter || '',
      helpFeelBetter: onboardingAnswers?.helpFeelBetter || '',
      likeToFellMore: onboardingAnswers?.likeToFellMore || '',
      feelThatWay: onboardingAnswers?.feelThatWay || '',
      howFellingLately: onboardingAnswers?.howFellingLately || '',
      hearAboutUs: onboardingAnswers?.hearAboutUs || '',
    };

    socialLoginMutate(
      { endpoint: endpoints.social_login, data: payload },
      {
        onSuccess: (response: any) => {
          if (response?.data?.is_onboarding === false) {
            dispatch(setUser(response?.data));
            dispatch(setToken(response?.data?.access_token));
            dispatch(setRefreshToken(response?.data?.refresh_token));
            dispatch(setAuth(true));
            dispatch(setLastLoginType(source));
            dispatch(setSocialEmail(email));
            dispatch(getUserDetail() as any);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: AppRoutes.AuthStack,
                  params: {
                    screen: AppRoutes.HearAboutUs,
                  },
                } as never,
              ],
            });
          } else {
            dispatch(setUser(response?.data));
            dispatch(setToken(response?.data?.access_token));
            dispatch(setRefreshToken(response?.data?.refresh_token));
            dispatch(setAuth(true));
            dispatch(setLastLoginType(source));
            dispatch(setSocialEmail(email));
            dispatch(getUserDetail() as any);
            if (response?.data?.user_subscription?.is_subscribed == 1) {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.NonAuthStack,
                    params: { screen: AppRoutes.BottomTab },
                  } as never,
                ],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.NonAuthStack,
                    params: { screen: AppRoutes.Premium },
                  } as never,
                ],
              });
            }
          }
        },
        onError: (error: any) => {
          console.log('error', error);
          AppUtils.showToast(error.message || 'Social login failed');
        },
      },
    );
  };

  const googleLogin = async () => {
    GoogleSignin.configure({
      webClientId:
        '81341323740-l50urv5g8cvo5i7fhjqdcnvgc9g0g96o.apps.googleusercontent.com',
    });

    try {
      GoogleSignin.signOut().catch(() => {});
      auth()
        .signOut()
        .catch(() => {});

      const { data }: any = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        data?.idToken ?? '',
      );
      const res = await auth().signInWithCredential(googleCredential);

      const additionalUserInfo = res?.additionalUserInfo as any;
      const name = additionalUserInfo?.profile?.name ?? '';
      const email = additionalUserInfo?.profile?.email ?? '';
      const uID = res?.user?.uid ?? '';

      if (uID && email) {
        handleSocialLogin(uID, email, name, 'google');
      } else {
        AppUtils.showToast('Google Sign-In Failed');
      }
    } catch (error: any) {
      console.log('Google Sign-In Error:', error);
      if (error.code !== 'ASYNC_OP_IN_PROGRESS' && error.code !== '7') {
        AppUtils.showToast('Google Sign-In Failed');
      }
    }
  };

  const appleLogin = async () => {
    try {
      dispatch(setLoader(true));
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        Alert.alert('Login Failed');
        return;
      }

      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
      const res = await auth().signInWithCredential(appleCredential);
      const email =
        res?.additionalUserInfo?.profile?.email || res?.user?.email || '';
      const name =
        res.user?.displayName ||
        (appleAuthRequestResponse?.fullName?.givenName
          ? `${appleAuthRequestResponse.fullName.givenName || ''} ${
              appleAuthRequestResponse.fullName.familyName || ''
            }`.trim()
          : '') ||
        '';
      const uID = res.user?.uid ?? '';

      if (uID && email) {
        handleSocialLogin(uID, email, name, 'apple');
      } else {
        AppUtils?.showToast('try again!');
      }
    } catch (error: any) {
      console.error('Apple Login Error:', error);
      if (error.code !== appleAuth.Error.CANCELED) {
        AppUtils.showToast('Apple Login Failed');
      }
    } finally {
      dispatch(setLoader(false));
    }
  };

  return { googleLogin, appleLogin, isSocialPending: isPending };
};

export default useSocialLogin;
