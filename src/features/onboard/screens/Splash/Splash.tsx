import { Image, View } from 'react-native';
import React, { useEffect } from 'react';

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
    }, 2000);
  }, [navigation]);
  return (
    <SolidView
      view={
        <View style={styles.container}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
      }
    />
  );
};

export default Splash;
