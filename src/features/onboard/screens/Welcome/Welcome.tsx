import { Image, View, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import SolidView from '../../../../components/SolidView';

import { useNavigation, useTheme } from '@react-navigation/native';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';

const Welcome = () => {
  const navigation = useNavigation();
  const { images, colors } = useTheme() as any;
  const { appLanguage, localization } = useContext(LocalizationContext) as any;
  console.log('appLanguage', appLanguage);
  const styles = style(colors);

  const getLangData = () => {
    switch (appLanguage) {
      case 'Spanish':
        return { flag: images.spain, code: 'ESP' };
      case 'French':
        return { flag: images.france, code: 'FRA' };
      case 'German':
        return { flag: images.germany, code: 'DEU' };
      case 'Russian':
        return { flag: images.russia, code: 'RUS' };
      case 'Portuguese':
        return { flag: images.portugal, code: 'POR' };
      case 'Italian':
        return { flag: images.italy, code: 'ITA' };
      default:
        return { flag: images.eng, code: 'ENG' };
    }
  };

  const { flag, code } = getLangData();
  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <Image
              source={images.h}
              style={styles.logoH}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.languagePill}
              onPress={() =>
                navigation.navigate(AppRoutes.SelectLanguage as never)
              }
            >
              <Image
                source={flag}
                style={styles.flagIcon}
                resizeMode="contain"
              />
              <SolidText style={styles.langCode}>{code}</SolidText>
            </TouchableOpacity>
          </View>
          <Image
            source={images.phone}
            resizeMode="contain"
            style={styles.phoneImage}
          />
          <SolidText style={styles.title}>
            {localization.appkeys?.healingStarts}
          </SolidText>
          <SolidBtn
            titleTxt={localization.appkeys?.welcome}
            btnStyle={styles.btn}
            onPress={() => navigation.navigate(AppRoutes.GetStarted as never)}
          />
          <SolidText
            onPress={() => navigation.navigate(AppRoutes.AccessScreen as never)}
            style={styles.footerText}
          >
            {localization.appkeys?.alreadyAccount}{' '}
            <SolidText style={styles.signInText}>
              {localization.appkeys?.signIn}
            </SolidText>
          </SolidText>
        </View>
      }
    />
  );
};

export default Welcome;
