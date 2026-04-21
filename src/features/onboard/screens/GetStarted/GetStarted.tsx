import React, { useContext } from 'react';
import { Image, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';

const GetStarted = () => {
  const navigation = useNavigation();
  const { images, colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
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
            {localization.appkeys?.reCenterSubtitle}
          </SolidText>
          <Image
            source={images.stars}
            resizeMode="contain"
            style={styles.starsImage}
          />
          <SolidText style={styles.quote}>
            {localization.appkeys?.quoteMindset}
          </SolidText>

          <SolidBtn
            titleTxt={localization.appkeys?.getStarted}
            btnStyle={styles.btn}
            onPress={() => navigation.navigate(AppRoutes.HearAboutUs as never)}
          />
        </View>
      }
    />
  );
};

export default GetStarted;
