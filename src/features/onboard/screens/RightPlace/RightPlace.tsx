import { Image, View } from 'react-native';
import React from 'react';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';

const RightPlace = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const styles = style(colors);

  return (
    <SolidView
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
            <SolidText style={styles.title}>You are in the right place!</SolidText>
            <SolidText style={styles.subtitle}>
              Heal will be by your side every step of the way
            </SolidText>

            <SolidBtn
              titleTxt="Next"
              btnStyle={styles.btn}
              onPress={() => navigation.navigate(AppRoutes.PrivacyMatters as never)}
            />
          </View>
        </View>
      }
    />
  );
};

export default RightPlace;
