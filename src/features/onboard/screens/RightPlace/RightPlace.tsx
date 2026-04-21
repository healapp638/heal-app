import React, { useContext } from 'react';
import { Image, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

const RightPlace = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <Image
              source={images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <SolidText style={styles.title}>
              {localization.appkeys?.rightPlaceTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.rightPlaceSub}
            </SolidText>

            <SolidBtn
              titleTxt={localization.appkeys?.next}
              btnStyle={styles.btn}
              onPress={() =>
                navigation.navigate(AppRoutes.PrivacyMatters as never)
              }
            />
          </View>
        </View>
      }
    />
  );
};

export default RightPlace;
