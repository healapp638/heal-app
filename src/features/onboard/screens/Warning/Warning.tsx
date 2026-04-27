import React, { useContext, useCallback } from 'react';
import { Image, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderCommon from '../../../../components/HeaderCommon';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import { useDispatch } from 'react-redux';
import { setOnboardingCurrentScreen } from '../../../../redux/Reducers/userData';

const Warning = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.Warning));
    }, [dispatch]),
  );

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 20 }}>
            <HeaderCommon title={localization.appkeys?.warningHeader} />
          </View>

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.importantNote}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.warningSubtitle}
            </SolidText>

            <SolidBtn
              titleTxt={localization.appkeys?.understandContinue}
              btnStyle={styles.btn}
              onPress={() =>
                navigation.navigate(AppRoutes.CreatingSpace as never)
              }
            />
          </View>
        </View>
      }
    />
  );
};

export default Warning;
