import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import { LocalizationContext } from '../../../../localization/localization';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import PremiumHeader from '../../../../components/PremiumHeader';
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

  const formatPrice = (price: number, priceString: string) => {
    const symbol = priceString.replace(/[0-9.,\s]/g, '').trim();
    const isSymbolFirst = priceString.startsWith(symbol);
    return isSymbolFirst
      ? `${symbol} ${price.toFixed(2)}`
      : `${price.toFixed(2)} ${symbol}`;
  };

  const getDynamicPrices = () => {
    let monthlyPrice = undefined;
    let yearlyPrice = undefined;

    if (packages) {
      if (packages.monthly) {
        monthlyPrice = packages.monthly.product.priceString + '/month';
      }
      if (packages.yearly) {
        const annualProduct = packages.yearly.product;
        const monthlyRate = annualProduct.price / 12;
        yearlyPrice = `${formatPrice(
          monthlyRate,
          annualProduct.priceString,
        )}/months`;
      }
    }

    return { monthlyPrice, yearlyPrice };
  };

  const { monthlyPrice, yearlyPrice } = getDynamicPrices();

  const getPriceInfoText = () => {
    if (selectedPlan === 'monthly') {
      const defaultText = localization.appkeys?.monthlyPriceInfo || '';
      if (packages?.monthly) {
        const priceStr = packages.monthly.product.priceString;
        return defaultText.replace(/CHF\s*10\.00/gi, priceStr);
      }
      return defaultText;
    } else {
      const defaultText = localization.appkeys?.yearlyPriceInfoNew || '';
      if (packages?.yearly) {
        const priceStr = packages.yearly.product.priceString;
        return defaultText.replace(/CHF\s*48\.00/gi, priceStr);
      }
      return defaultText;
    }
  };
  const [showCloseBtn, setShowCloseBtn] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCloseBtn(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
            showCloseBtn={showCloseBtn}
            onClose={() => {
              triggerHaptic('impactMedium');

              Alert.alert(
                localization.appkeys?.logoutDescription || 'Logout',
                '',
                [
                  {
                    text: localization.appkeys?.cancel || 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: localization.appkeys?.logout || 'Logout',
                    style: 'destructive',
                    onPress: () => {
                      triggerHaptic('impactMedium');

                      dispatch(clearOnboardingProgress());
                      dispatch(setAuth(false));
                      dispatch(setUser({}));
                      dispatch(setToken(null));
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
                    },
                  },
                ],
              );
            }}
            styles={styles}
            images={images}
          />

          <SolidText style={styles.title}>
            {localization.appkeys?.howTrialWorks}
          </SolidText>
          <SolidText style={styles.subtitle}>
            {localization.appkeys?.notChargedToday}
          </SolidText>

          <TimelineCard
            localization={localization}
            styles={styles}
            images={images}
            trialReminderDate={trialReminderDate}
            becomeMemberDate={becomeMemberDate}
            selectedPlan={selectedPlan}
          />

          {selectedPlan == 'yearly' && (
            <ReminderToggle
              localization={localization}
              styles={styles}
              images={images}
              reminderEnabled={reminderEnabled}
              onToggle={() => setReminderEnabled(!reminderEnabled)}
            />
          )}

          <PlansSection
            localization={localization}
            styles={styles}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            monthlyPrice={monthlyPrice}
            yearlyPrice={yearlyPrice}
          />
          <View style={{ flex: 1 }} />
          <SolidBtn
            maxFontScale={1}
            btnStyle={styles.actionBtn}
            txtStyle={styles.actionBtnText}
            titleTxt={
              selectedPlan === 'monthly'
                ? localization.appkeys?.startMyJourney
                : localization.appkeys?.startMy3DayFreeTrial
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

          <SolidText style={styles.priceInfo}>{getPriceInfoText()}</SolidText>

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
