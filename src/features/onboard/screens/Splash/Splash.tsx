import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Video from 'react-native-video';

import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';
import SolidView from '../../../../components/SolidView';

const Splash = () => {
  const navigation = useNavigation();
  const { images, colors } = useTheme() as any;
  const styles = style(colors);

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(AppRoutes.Welcome as never);
    }, 3000);
  }, [navigation]);
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
