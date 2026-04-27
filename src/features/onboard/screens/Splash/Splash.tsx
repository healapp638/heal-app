import { View, StyleSheet, Alert } from 'react-native';
import React, { useEffect } from 'react';
import Video from 'react-native-video';

import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';
import SolidView from '../../../../components/SolidView';
import { useSelector } from 'react-redux';

const Splash = () => {
  const navigation = useNavigation();
  const { images, colors } = useTheme() as any;
  const styles = style(colors);
  const auth = useSelector((state: any) => state.userData?.auth);
  const user = useSelector((state: any) => state.userData?.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!auth) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: AppRoutes.Welcome,
            } as never,
          ],
        });
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
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <SolidView
      view={
        <View style={styles.container}>
          <Video
            source={images.splash}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
            muted={true}
          />
        </View>
      }
    />
  );
};

export default Splash;
