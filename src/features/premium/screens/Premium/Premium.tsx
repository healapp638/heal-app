import React, { useContext, useEffect, useState } from 'react';
import { View, BackHandler } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import { LocalizationContext } from '../../../../localization/localization';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import PremiumHeader from '../../../../components/PremiumHeader';
import AppFonts from '../../../../constants/fonts';
import TimelineCard from '../../../../components/TimelineCard';
import ReminderToggle from '../../../../components/ReminderToggle';
import PlansSection from '../../../../components/PlansSection';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { useSelector, useDispatch } from 'react-redux';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { useSubscription } from '../../../../hooks/useSubscription';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import {
  setAuth,
  setToken,
  setRefreshToken,
  setUser,
  clearOnboardingProgress,
} from '../../../../redux/Reducers/userData';
import { clearModuleParams } from '../../../../redux/Reducers/tempData';

const Premium = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const { purchasePlan, packages } = useSubscription();
  const { mutate: syncPurchaseApi } = usePostApi();
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const [purchasing, setPurchasing] = useState(false);
  const styles = style(colors, appLanguage);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>(
    'yearly',
  );

  const getDynamicPrices = () => {
    let monthlyPrice = undefined;
    let yearlyPrice = undefined;

    if (packages) {
      if (packages.monthly) {
        monthlyPrice = packages.monthly.product.priceString + '/month';
      }
      if (packages.yearly) {
        yearlyPrice = packages.yearly.product.priceString + '/year';
      }
    }

    return { monthlyPrice, yearlyPrice };
  };

  const { monthlyPrice, yearlyPrice } = getDynamicPrices();

  const renderPriceInfoText = (
    text: string,
    priceStr: string,
    textStyle: any,
    boldColor: string,
  ) => {
    if (!priceStr || !text.includes(priceStr)) {
      return <SolidText style={textStyle}>{text}</SolidText>;
    }

    const parts = text.split(priceStr);
    if (parts.length >= 2) {
      const beforePrice = parts[0];
      const afterPrice = parts[1];

      const dotIndex = afterPrice.indexOf('.');
      if (dotIndex !== -1) {
        const periodSuffix = afterPrice.substring(0, dotIndex);
        const rest = afterPrice.substring(dotIndex);

        return (
          <SolidText maxFontScale={1} style={textStyle}>
            {beforePrice}
            <SolidText
              maxFontScale={1}
              style={[
                textStyle,
                { fontFamily: AppFonts.bold, color: boldColor },
              ]}
            >
              {priceStr}
              {periodSuffix}
            </SolidText>
            {rest}
          </SolidText>
        );
      }
    }

    return <SolidText style={textStyle}>{text}</SolidText>;
  };

  const getPriceInfo = () => {
    let priceStr = 'CHF 10.00';
    let text = '';
    if (selectedPlan === 'monthly') {
      text = localization.appkeys?.monthlyPriceInfo || '';
      if (packages?.monthly) {
        priceStr = packages.monthly.product.priceString;
        text = text.replace(/CHF\s*10\.00/gi, priceStr);
      }
    } else {
      text = localization.appkeys?.yearlyPriceInfoNew || '';
      if (packages?.yearly) {
        priceStr = packages.yearly.product.priceString;
        text = text.replace(/CHF\s*48\.00/gi, priceStr);
      } else {
        priceStr = 'CHF 48.00';
      }
    }
    return { text, priceStr };
  };

  const { text: priceInfoText, priceStr } = getPriceInfo();

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
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Helper to get formatted dates for the timeline
  const getTimelineDate = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  const trialReminderDate = getTimelineDate(2);
  const becomeMemberDate = getTimelineDate(3);
  return (
    <SolidView
      isScrollEnabled={true}
      view={
        <View style={styles.mainContainer}>
          <PremiumHeader
            showCloseBtn={true}
            onClose={() => {
              triggerHaptic('impactMedium');

              navigation.goBack();
            }}
            styles={styles}
            images={images}
            title={'Healing starts with you'}
          />

          <TimelineCard
            localization={localization}
            styles={styles}
            images={images}
            trialReminderDate={trialReminderDate}
            becomeMemberDate={becomeMemberDate}
            selectedPlan={selectedPlan}
          />

          {selectedPlan === 'yearly' && (
            <ReminderToggle
              localization={localization}
              styles={styles}
              images={images}
              reminderEnabled={reminderEnabled}
              onToggle={() => setReminderEnabled(!reminderEnabled)}
            />
          )}

          <View style={{ flex: 0.8 }} />

          <PlansSection
            localization={localization}
            styles={styles}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            monthlyPrice={monthlyPrice}
            yearlyPrice={yearlyPrice}
            appLanguage={appLanguage}
          />
          <View style={{ height: 10 }} />
          <SolidBtn
            maxFontScale={1}
            btnStyle={styles.actionBtn}
            txtStyle={styles.actionBtnText}
            titleTxt={
              selectedPlan === 'monthly'
                ? localization.appkeys?.startMyJourney
                : localization.appkeys.startMyFreeTrail
              // : getStartFreeTrialText(
              //     appLanguage,
              //     yearlyPrice || localization.appkeys?.yearlyPrice,
              //   )
            }
            isLoading={purchasing}
            disabled={purchasing}
            onPress={async () => {
              triggerHaptic('impactMedium');
              setPurchasing(true);
              const success = await purchasePlan(selectedPlan);
              if (success) {
                syncPurchaseApi({
                  endpoint: endpoints.sync_purchase,
                  data: {},
                });
                setPurchasing(false);
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: AppRoutes.BottomTab as never,
                    },
                  ],
                });
              } else {
                setPurchasing(false);
              }
            }}
          />

          {renderPriceInfoText(
            priceInfoText,
            priceStr,
            styles.priceInfo,
            colors.brown,
          )}

          {/* <TouchableOpacity style={styles.promoBtn}>
            <SolidText style={styles.promoText}>
              {localization.appkeys?.addPromoCode}
            </SolidText>
          </TouchableOpacity> */}
        </View>
      }
    />
  );
};
export default Premium;
