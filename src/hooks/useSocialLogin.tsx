import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { Alert, Platform } from 'react-native';
import usePostApi from './usePostApi';
import { endpoints } from '../api/Services/endpoints';
import { useDispatch } from 'react-redux';
import { setAuth, setToken, setUser } from '../redux/Reducers/userData';
import { useNavigation } from '@react-navigation/native';
import AppRoutes from '../routes/RouteKeys/appRoutes';
import AppUtils from '../utils/appUtils';

const useSocialLogin = () => {
  const { mutate: socialLoginMutate, isPending } = usePostApi();
  const dispatch = useDispatch();
  const navigation = useNavigation();

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

      const payload = {
        login_source: 'google',
        social_auth: uID,
        email: email,
        name: name,
        os_type: Platform.OS,
      };

      socialLoginMutate(
        { endpoint: endpoints.social_login, data: payload },
        {
          onSuccess: (response: any) => {
            if (response?.data?.is_profile_completed == false) {
              dispatch(setToken(response?.data?.access_token));
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
              dispatch(setAuth(true));
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
    } catch (error: any) {
      console.log('Google Sign-In Error:', error);
      // ASYNC_OP_IN_PROGRESS usually means the picker is already open
      if (error.code !== 'ASYNC_OP_IN_PROGRESS' && error.code !== '7') {
        AppUtils.showToast('Google Sign-In Failed');
      }
    }
  };

  return { googleLogin, isSocialPending: isPending };
};

export default useSocialLogin;
