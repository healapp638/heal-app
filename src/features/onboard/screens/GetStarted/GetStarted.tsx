import { Image, View } from 'react-native';
import React from 'react';
import SolidView from '../../../../components/SolidView';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

const GetStarted = () => {
  const navigation = useNavigation();
  const { images, colors } = useTheme() as any;
  const styles = style(colors);

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <Image
            resizeMode="contain"
            source={images.logo}
            style={styles.logo}
          />
          <Image
            source={images.start}
            resizeMode="contain"
            style={styles.startImage}
          />
          <SolidText style={styles.description}>
            Re-center your mind. Transform your life.
          </SolidText>
          <Image
            source={images.stars}
            resizeMode="contain"
            style={styles.starsImage}
          />
          <SolidText style={styles.quote}>
            "Exactly what I needed to reset my mindset"
          </SolidText>

          <SolidBtn
            titleTxt="Get Started"
            btnStyle={styles.btn}
            onPress={() => navigation.navigate(AppRoutes.HearAboutUs as never)}
          />
        </View>
      }
    />
  );
};

export default GetStarted;
