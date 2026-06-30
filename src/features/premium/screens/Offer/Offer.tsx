import React, { useContext, useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import SolidView from '../../../../components/SolidView';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';
import SolidBtn from '../../../../components/SolidBtn';
import SolidText from '../../../../components/SolidText';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { useSubscription } from '../../../../hooks/useSubscription';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import {
  setAuth,
  setToken,
  setRefreshToken,
  setUser,
  clearOnboardingProgress,
} from '../../../../redux/Reducers/userData';
import { clearModuleParams } from '../../../../redux/Reducers/tempData';
import HeaderCommon from '../../../../components/HeaderCommon';

const Offer = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const fromCreatingSpace = route.params?.fromCreatingSpace;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const { packages } = useSubscription();
  const styles = style(colors);

  const getYearlyPriceInfo = () => {
    let text = localization.appkeys?.yearlyPriceInfoNew || '';
    let priceStr = 'CHF 48.00';
    if (packages?.yearly) {
      priceStr = packages.yearly.product.priceString;
      text = text.replace(/CHF\s*48\.00/gi, priceStr);
    }
    return { text, priceStr };
  };

  const { text: priceInfoText, priceStr } = getYearlyPriceInfo();
  const yearlyPriceDisplay = `${priceStr}/year`;

  const handleLogoutAndRedirect = React.useCallback(() => {
    triggerHaptic('impactMedium');

    dispatch(clearOnboardingProgress());
    dispatch(setAuth(false));
    dispatch(setUser({}));
    dispatch(setToken(null));
    dispatch(setRefreshToken(null));
    dispatch(clearModuleParams());
    queryClient.clear();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: AppRoutes.AuthStack as never,
          params: {
            screen: AppRoutes.AccessScreen,
          },
        },
      ],
    });
  }, [dispatch, queryClient, navigation]);

  useEffect(() => {
    const backAction = () => {
      if (fromCreatingSpace) {
        navigation.goBack();
      } else {
        handleLogoutAndRedirect();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [handleLogoutAndRedirect, fromCreatingSpace, navigation]);

  return (
    <SolidView
      isScrollEnabled={false}
      view={
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 20, zIndex: 999 }}>
            <HeaderCommon
              onBackPress={
                fromCreatingSpace
                  ? () => navigation.goBack()
                  : handleLogoutAndRedirect
              }
            />
          </View>
          <View style={styles.mainContainer}>
            {/* <SolidText style={styles.priceHeader}>
              {yearlyPriceDisplay}
            </SolidText> */}

            <SolidText style={styles.title}>
              {localization.appkeys?.offerTrialText}
            </SolidText>

            {/* <SolidText style={styles.infoText}>
              {priceInfoText}
            </SolidText> */}

            <SolidBtn
              btnStyle={styles.btn}
              titleTxt={localization.appkeys?.tryFreeBtn}
              onPress={() => {
                return navigation.navigate(AppRoutes.Reminder as never);
              }}
            />
          </View>
        </View>
      }
    />
  );
};
export default Offer;
