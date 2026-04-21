import React, { useContext, useState } from 'react';
import { View, Image, TouchableOpacity, Switch, Platform } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import { LocalizationContext } from '../../../../localization/localization';
import SolidBtn from '../../../../components/SolidBtn';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';

const Premium = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>(
    'yearly',
  );

  // Helper to get formatted dates for the timeline
  const getTimelineDate = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const trialReminderDate = getTimelineDate(2);
  const becomeMemberDate = getTimelineDate(3);

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          {/* Header */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={images.cross2}
              style={styles.closeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Title Section */}
          <SolidText style={styles.title}>
            {localization.appkeys?.howTrialWorks}
          </SolidText>
          <SolidText style={styles.subtitle}>
            {localization.appkeys?.notChargedToday}
          </SolidText>

          {/* Timeline Card */}
          <View style={styles.timelineCard}>
            <View style={styles.timelineLeft}>
              <Image
                source={images.premium}
                style={styles.premiumImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.timelineRight}>
              <View style={styles.timelineItem}>
                <SolidText style={styles.timelineTitle}>
                  {localization.appkeys?.todayFreeTrialStarts}
                </SolidText>
                <SolidText style={styles.timelineSub}>
                  {localization.appkeys?.enjoyFullAccess}
                </SolidText>
              </View>

              <View style={{ ...styles.timelineItem, marginVertical: 20 }}>
                <SolidText style={styles.timelineTitle}>
                  {trialReminderDate} -{' '}
                  {localization.appkeys?.trialReminderDate?.split(' - ')[1] ||
                    'Trial reminder'}
                </SolidText>
                <SolidText style={styles.timelineSub}>
                  {localization.appkeys?.endingSoon}
                </SolidText>
              </View>

              <View style={styles.timelineItem}>
                <SolidText style={styles.timelineTitle}>
                  {becomeMemberDate} -{' '}
                  {localization.appkeys?.becomeMemberDate?.split(' - ')[1] ||
                    'Become member'}
                </SolidText>
                <SolidText style={styles.timelineSub}>
                  {localization.appkeys?.endsUnlessCanceled}
                </SolidText>
              </View>
            </View>
          </View>

          {/* Reminder Toggle */}
          <View style={styles.reminderRow}>
            <SolidText style={styles.reminderText}>
              {localization.appkeys?.reminderBeforeEnds}
            </SolidText>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            />
          </View>

          {/* Subscription Plans */}
          <View style={styles.plansContainer}>
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'monthly' && styles.activePlanCard,
              ]}
              onPress={() => setSelectedPlan('monthly')}
            >
              <SolidText style={styles.planLabel}>
                {localization.appkeys?.monthly}
              </SolidText>
              <SolidText style={styles.planPrice}>
                {localization.appkeys?.monthlyPrice}
              </SolidText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'yearly' && styles.activePlanCard,
              ]}
              onPress={() => setSelectedPlan('yearly')}
            >
              <View style={styles.badge}>
                <SolidText style={styles.badgeText}>
                  {localization.appkeys?.save60}
                </SolidText>
              </View>
              <SolidText style={styles.planLabel}>
                {localization.appkeys?.yearly}
              </SolidText>
              <SolidText style={styles.planPrice}>
                {localization.appkeys?.yearlyPrice}
              </SolidText>
            </TouchableOpacity>
          </View>

          {/* Price Detail */}
          <SolidText style={styles.priceInfo}>
            {localization.appkeys?.yearlyPriceInfo}
          </SolidText>

          {/* Action Button */}
          <SolidBtn
            btnStyle={styles.actionBtn}
            txtStyle={styles.actionBtnText}
            titleTxt={localization.appkeys?.startFreeTrialBtn}
            onPress={() => {}}
          />

          {/* Promo Code */}
          <TouchableOpacity style={styles.promoBtn}>
            <SolidText style={styles.promoText}>
              {localization.appkeys?.addPromoCode}
            </SolidText>
          </TouchableOpacity>

          {/* Footer Links */}
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <SolidText style={styles.footerLink}>
                {localization.appkeys?.restore}
              </SolidText>
            </TouchableOpacity>
            <View style={styles.footerDot} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(AppRoutes.PrivacyPolicy as never)
              }
            >
              <SolidText style={styles.footerLink}>
                {localization.appkeys?.privacyPolicy}
              </SolidText>
            </TouchableOpacity>
            <View style={styles.footerDot} />
            <TouchableOpacity
              onPress={() => navigation.navigate(AppRoutes.Terms as never)}
            >
              <SolidText style={styles.footerLink}>
                {localization.appkeys?.termsOfService}
              </SolidText>
            </TouchableOpacity>
          </View>
        </View>
      }
    />
  );
};

export default Premium;
