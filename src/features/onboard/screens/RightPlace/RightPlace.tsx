import React, { useContext, useCallback } from 'react';
import { Image, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import { useDispatch } from 'react-redux';
import { setOnboardingCurrentScreen } from '../../../../redux/Reducers/userData';
import HeaderCommon from '../../../../components/HeaderCommon';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const RightPlace = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.RightPlace));
    }, [dispatch]),
  );
  return (
    <SolidView
      isScrollEnabled
      viewStyle={{
        flex: 1,
      }}
      view={
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: -50,
              zIndex: 999,
            }}
          >
            <HeaderCommon title={''} />
          </View>

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.rightPlaceTitle}
            </SolidText>

            <SolidBtn
              titleTxt={localization.appkeys?.next}
              btnStyle={styles.btn}
              onPress={() => {
                triggerHaptic();
                return navigation.navigate(AppRoutes.EnterName as never);
              }}
            />
          </View>
        </View>
      }
    />
  );
};
export default RightPlace;
