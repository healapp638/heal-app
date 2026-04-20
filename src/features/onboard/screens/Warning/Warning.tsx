import { Image, View } from 'react-native';
import React from 'react';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderCommon from '../../../../components/HeaderCommon';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';

const Warning = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const styles = style(colors);

  return (
    <SolidView
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 20 }}>
            <HeaderCommon title="Warning" />
          </View>

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>Important note</SolidText>
            <SolidText style={styles.subtitle}>
              Heal supports your emotional well-being but is not a replacement
              for professional medical or mental health care.
            </SolidText>

            <SolidBtn
              titleTxt="I understand, Continue"
              btnStyle={styles.btn}
              onPress={() => navigation.navigate(AppRoutes.CreatingSpace as never)}
            />
          </View>
        </View>
      }
    />
  );
};

export default Warning;
