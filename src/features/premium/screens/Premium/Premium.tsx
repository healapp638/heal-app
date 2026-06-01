import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
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
import { useSelector } from 'react-redux';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const Premium = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const styles = style(colors, appLanguage);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>(
    'yearly',
  );
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
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.BottomTab as never,
                  },
                ],
              });
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

          <ReminderToggle
            localization={localization}
            styles={styles}
            images={images}
            reminderEnabled={reminderEnabled}
            onToggle={() => setReminderEnabled(!reminderEnabled)}
          />

          <PlansSection
            localization={localization}
            styles={styles}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />

          <SolidBtn
            maxFontScale={1}
            btnStyle={styles.actionBtn}
            txtStyle={styles.actionBtnText}
            titleTxt={
              selectedPlan === 'monthly'
                ? localization.appkeys?.startMyJourney
                : localization.appkeys?.startMy3DayFreeTrial
            }
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.BottomTab as never,
                  },
                ],
              });
            }}
          />

          <SolidText style={styles.priceInfo}>
            {selectedPlan === 'monthly'
              ? localization.appkeys?.monthlyPriceInfo
              : localization.appkeys?.yearlyPriceInfoNew}
          </SolidText>

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
