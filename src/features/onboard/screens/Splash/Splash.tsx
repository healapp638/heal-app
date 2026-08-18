import { View, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';
import { clearOnboardingProgress, getUserDetail } from '../../../../redux/Reducers/userData';
import { useNavigation, useTheme } from '@react-navigation/native';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';
import SolidView from '../../../../components/SolidView';
import {
  RESUMABLE_ONBOARDING_ROUTES,
} from '../../utils/onboardingProgress';
import { startSuperwallOnboarding } from '../../../../utils/superwallService';

const Splash = () => {
  const navigation = useNavigation();
  const { images, colors } = useTheme() as any;
  const styles = style(colors);
  const auth = useSelector((state: any) => state.userData?.auth);
  const user = useSelector((state: any) => state.userData?.user);
  const onboarding = useSelector((state: any) => state.userData?.onboarding);

  const dispatch = useDispatch();
  const { mutate: postApi } = usePostApi();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (auth) {
      // postApi(
      //   {
      //     endpoint: endpoints.claimStreak,
      //     data: {},
      //   },
      //   {
      //     onSuccess: () => {
      //       dispatch(getUserDetail() as any);
      //     },
      //     onError: (error: any) => {
      //       console.log('claimStreak error', error);
      //       dispatch(getUserDetail() as any);
      //     },
      //   },
      // );
    }
  }, [auth, postApi, dispatch]);

  const handleNavigation = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    if (!auth) {
      const canResume =
        !auth &&
        !onboarding?.isCompleted &&
        onboarding?.hasStarted &&
        onboarding?.currentScreen !== AppRoutes.GetStarted &&
        onboarding?.currentScreen !== AppRoutes.HearAboutUs &&
        RESUMABLE_ONBOARDING_ROUTES.includes(onboarding?.currentScreen);

      if (canResume) {
        navigation.reset({
          index: 0,
          routes: [{ name: AppRoutes.Welcome } as never],
        });
      } else {
        dispatch(clearOnboardingProgress());
        navigation.reset({
          index: 0,
          routes: [{ name: AppRoutes.Welcome } as never],
        });
      }
    } else {
      if (user?.is_profile_completed == false) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: AppRoutes.CompleteProfile,
              params: { userData: user },
            } as never,
          ],
        });
      } else {
        if (user?.user_subscription?.is_subscribed == 1) {
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
                params: { screen: AppRoutes.Offer },
              } as never,
            ],
          });
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={images.splash}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        muted={true}
        playWhenInactive={true}
        playInBackground={false}
        ignoreSilentSwitch={'obey'}
        onEnd={handleNavigation}
        onError={handleNavigation}
        disableFocus={true}
      />
    </View>
  );
};

export default Splash;
