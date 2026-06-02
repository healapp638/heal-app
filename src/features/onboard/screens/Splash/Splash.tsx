import { View, StyleSheet, Alert } from 'react-native';
import React, { useEffect } from 'react';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetail } from '../../../../redux/Reducers/userData';
import { useNavigation, useTheme } from '@react-navigation/native';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';
import SolidView from '../../../../components/SolidView';

const Splash = () => {
  const navigation = useNavigation();
  const { images, colors } = useTheme() as any;
  const styles = style(colors);
  const auth = useSelector((state: any) => state.userData?.auth);
  const user = useSelector((state: any) => state.userData?.user);

  const dispatch = useDispatch();
  const { mutate: postApi } = usePostApi();

  useEffect(() => {
    if (auth) {
      postApi(
        {
          endpoint: endpoints.claimStreak,
          data: {},
        },
        {
          onSuccess: () => {
            dispatch(getUserDetail() as any);
          },
          onError: (error: any) => {
            console.log('claimStreak error', error);
            dispatch(getUserDetail() as any);
          },
        },
      );
    }
  }, [auth, postApi, dispatch]);

  const handleNavigation = () => {
    if (!auth) {
      navigation.reset({
        index: 0,
        routes: [{ name: AppRoutes.Welcome } as never],
      });
    } else {
      if (user?.is_onboarding == false) {
        // If in between the onboarding flow, navigate to HearAboutUs and show ResumeModal
        navigation.reset({
          index: 0,
          routes: [
            {
              name: AppRoutes.AuthStack,
              params: {
                screen: AppRoutes.HearAboutUs,
                params: { showResumeModal: true },
              },
            } as never,
          ],
        });
      } else if (user?.is_profile_completed == false) {
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
        navigation.reset({
          index: 0,
          routes: [
            {
              name: AppRoutes.NonAuthStack,
              params: { screen: AppRoutes.BottomTab },
            } as never,
          ],
        });
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
