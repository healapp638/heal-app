import { Image, View } from 'react-native';
import React from 'react';
import SolidView from '../../../../components/SolidView';

import { useNavigation, useTheme } from '@react-navigation/native';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

const Welcome = () => {
  const navigation = useNavigation();
  const { images, colors } = useTheme() as any;
  const styles = style(colors);
  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <Image
              source={images.h}
              style={styles.logoH}
              resizeMode="contain"
            />
          </View>
          <Image
            source={images.phone}
            resizeMode="contain"
            style={styles.phoneImage}
          />
          <SolidText style={styles.title}>Healing starts with you</SolidText>
          <SolidBtn
            titleTxt="Welcome"
            btnStyle={styles.btn}
            onPress={() => navigation.navigate(AppRoutes.GetStarted as never)}
          />
          <SolidText style={styles.footerText}>
            Already have an account?{' '}
            <SolidText style={styles.signInText}>Sign in</SolidText>
          </SolidText>
        </View>
      }
    />
  );
};

export default Welcome;
