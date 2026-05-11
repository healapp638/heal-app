import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Alert, Platform } from 'react-native';
import usePostApi from './usePostApi';
import { endpoints } from '../api/Services/endpoints';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAuth,
  setToken,
  setRefreshToken,
  setUser,
  getUserDetail,
} from '../redux/Reducers/userData';
import { useNavigation } from '@react-navigation/native';
import AppRoutes from '../routes/RouteKeys/appRoutes';
import AppUtils from '../utils/appUtils';
import { setLoader } from '../redux/Reducers/tempData';

const useSocialLogin = () => {
  const { mutate: socialLoginMutate, isPending } = usePostApi();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);

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
      name: name,
      os_type: Platform.OS,
      language: AppUtils.getLanguageCode(appLanguage),
    };

    socialLoginMutate(
      { endpoint: endpoints.social_login, data: payload },
      {
        onSuccess: (response: any) => {
          if (response?.data?.is_profile_completed == false) {
            dispatch(setToken(response?.data?.access_token));
            dispatch(setRefreshToken(response?.data?.refresh_token));
            dispatch(setUser(response?.data));
            dispatch(setAuth(true));
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: AppRoutes.CompleteProfile,
                  params: { userData: response?.data },
                } as never,
              ],
            });
          } else {
            dispatch(setUser(response?.data));
            dispatch(setToken(response?.data?.access_token));
            dispatch(setRefreshToken(response?.data?.refresh_token));
            dispatch(setAuth(true));
            dispatch(getUserDetail() as any);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: AppRoutes.NonAuthStack,
                  params: { screen: AppRoutes.Offer },
                } as never,
              ],
            });
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
      const email = res?.additionalUserInfo?.profile?.email;
      const name =
        res.user?.displayName ||
        appleAuthRequestResponse?.fullName?.givenName ||
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
