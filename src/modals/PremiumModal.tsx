import React, { useContext, useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { LocalizationContext } from '../localization/localization';
import { useSelector } from 'react-redux';
import { hp, wp } from '../utils/dimension';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import SolidText from '../components/SolidText';
import SolidBtn from '../components/SolidBtn';
import PremiumHeader from '../components/PremiumHeader';
import TimelineCard from '../components/TimelineCard';
import ReminderToggle from '../components/ReminderToggle';
import PlansSection from '../components/PlansSection';
import AppRoutes from '../routes/RouteKeys/appRoutes';
import { useSubscription } from '../hooks/useSubscription';
import { triggerHaptic } from '../hooks/useHaptic';
import usePostApi from '../hooks/usePostApi';
import { endpoints } from '../api/Services/endpoints';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
}

const getStartFreeTrialText = (appLanguage: string, priceStr: string) => {
  const lang = (appLanguage || 'English').toLowerCase();
  let prefix = "Start Free Trial";
  switch (lang) {
    case 'french':
      prefix = "Démarrer l'essai gratuit";
      break;
    case 'spanish':
      prefix = "Iniciar prueba gratuita";
      break;
    case 'german':
      prefix = "Kostenlose Testversion starten";
      break;
    case 'portuguese':
      prefix = "Iniciar teste gratuito";
      break;
    case 'italian':
      prefix = "Inizia la prova gratuita";
      break;
    case 'russian':
      prefix = "Начать бесплатную версию";
      break;
    default:
      prefix = "Start Free Trial";
      break;
  }
  return `${prefix} – ${priceStr}`;
};

const PremiumModal = ({ visible, onClose }: PremiumModalProps) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const { purchasePlan, packages } = useSubscription();
  const { mutate: syncPurchaseApi } = usePostApi();
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const styles = useStyles(colors, appLanguage);

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

  const renderPriceInfoText = (text: string, priceStr: string, textStyle: any, boldColor: string) => {
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
          <SolidText style={textStyle}>
            {beforePrice}
            <SolidText style={[textStyle, { fontFamily: AppFonts.bold, color: boldColor }]}>
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
  const [showCloseBtn, setShowCloseBtn] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setShowCloseBtn(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowCloseBtn(false);
    }
  }, [visible]);

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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.mainContainer}>
              <PremiumHeader
                showCloseBtn={showCloseBtn}
                onClose={onClose}
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
                monthlyPrice={monthlyPrice}
                yearlyPrice={yearlyPrice}
                appLanguage={appLanguage}
              />

              <SolidBtn
                maxFontScale={1}
                btnStyle={styles.actionBtn}
                txtStyle={styles.actionBtnText}
                titleTxt={
                  selectedPlan === 'monthly'
                    ? localization.appkeys?.startMyJourney
                    : getStartFreeTrialText(appLanguage, yearlyPrice || localization.appkeys?.yearlyPrice)
                }
                onPress={async () => {
                  triggerHaptic('impactMedium');
                  const success = await purchasePlan(selectedPlan);
                  if (success) {
                    syncPurchaseApi({
                      endpoint: endpoints.sync_purchase,
                      data: {},
                    });
                    onClose();
                  }
                }}
              />

              {renderPriceInfoText(priceInfoText, priceStr, styles.priceInfo, '#3A2110')}

              <TouchableOpacity style={styles.promoBtn}>
                <SolidText style={styles.promoText}>
                  {localization.appkeys?.addPromoCode}
                </SolidText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const useStyles = (colors: any, appLanguage: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: '#F7F3EB', // Light beige background from screenshot
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      maxHeight: '93%', // Not full screen, similar to GetCreditsModal
    },
    scrollContent: {
      paddingBottom: 40,
    },
    mainContainer: {
      paddingHorizontal: 24,
    },
    closeBtn: {
      marginTop: Platform.OS === 'ios' ? 10 : 20,
      marginBottom: hp(1),
      height: 30,
      width: 30,
      justifyContent: 'center',
    },
    closeBtnPlaceholder: {
      marginTop: Platform.OS === 'ios' ? 10 : 20,
      marginBottom: hp(1),
      height: 30,
    },
    closeIcon: {
      width: 16,
      height: 16,
      tintColor: '#C4C4C4',
    },
    title: {
      fontSize: AppUtils.fontSize(28),
      textAlign: 'center',
      fontFamily: AppFonts.recoMedium,
      color: '#3A2110',
      includeFontPadding: false,
      marginTop: 10,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: '#3A2110',
      textAlign: 'center',
      marginTop: 8,
      marginBottom: hp(3),
    },
    timelineCard: {
      backgroundColor: 'white',
      borderRadius: 28,
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 10,
      marginBottom: hp(3),
    },
    timelineLeft: {
      width: wp(12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    premiumImage: {
      width: wp(11),
      height: Platform.OS == 'ios' ? hp(32) : hp(34),

      resizeMode: 'stretch',
    },
    premiumImage2: {
      width: wp(11),
      height: Platform.OS == 'ios' ? hp(32) : hp(34),

      resizeMode: 'stretch',
    },
    timelineRight: {
      flex: 1,
      paddingLeft: 10,
    },
    timelineItem: {
      justifyContent: 'center',
    },
    timelineItemCenter: {
      justifyContent: 'center',
      marginVertical: Platform.OS == 'ios' ? hp(3) : hp(2.5),
    },
    timelineTitle: {
      fontFamily: AppFonts.recoMedium,
      fontSize: AppUtils.fontSize(18),
      color: '#3A2110',
      includeFontPadding: false,
    },
    timelineSub: {
      fontFamily: AppFonts.regular,
      fontSize: 13,
      color: '#7A7A7A',
      includeFontPadding: false,
      marginTop: 4,
    },
    reminderRow: {
      backgroundColor: 'white',
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
      marginBottom: hp(4),
    },
    reminderText: {
      fontFamily: AppFonts.regular,
      fontSize: 15,
      color: '#3A2110',
      includeFontPadding: false,
    },
    toggleIcon: {
      width: 48,
      height: 28,
    },
    plansContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      width: '100%',
    },
    planCard: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 12,
      borderWidth: 2,
      borderColor: 'transparent',
      width: '48%',
      height: 115,
      justifyContent: 'center',
    },
    activePlanCard: {
      borderColor: '#3A2110',
    },
    planLabel: {
      fontFamily: AppFonts.bold,
      fontSize: AppUtils.fontSize(16),
      color: '#3A2110',
      marginBottom: 2,
      includeFontPadding: false,
    },
    planPriceAmount: {
      fontFamily: AppFonts.recoBold,
      fontSize: AppUtils.fontSize(26),
      color: '#3A2110',
      marginTop: 2,
      includeFontPadding: false,
    },
    planPricePeriod: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#7A7A7A',
      marginTop: 2,
      includeFontPadding: false,
    },
    badge: {
      position: 'absolute',
      top: -12,
      right: -8,
      backgroundColor: '#FF7D7D', // Pinkish red from screenshot
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      zIndex: 10,
    },
    badgeText: {
      fontFamily: AppFonts.bold,
      fontSize: AppUtils.fontSize(11),
      color: 'white',
      includeFontPadding: false,
      textTransform: 'uppercase',
    },
    priceInfo: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(13),
      color: '#7A7A7A',
      textAlign: 'center',
      marginBottom: hp(4),
      includeFontPadding: false,
    },
    actionBtn: {
      width: '100%',
      backgroundColor: '#3A2110',
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    actionBtnText: {
      fontFamily: AppFonts.bold,
      fontSize: AppUtils.fontSize(18),
      color: 'white',
      includeFontPadding: false,
    },
    promoBtn: {
      alignSelf: 'center',
      marginBottom: hp(4),
    },
    promoText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      color: '#3A2110',
      textDecorationLine: 'underline',
      includeFontPadding: false,
    },
    footerLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: hp(2),
      width: '100%',
      alignSelf: 'center',
    },
    footerLink: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#7A7A7A',
      includeFontPadding: false,
    },
    footerDot: {
      marginHorizontal: 8,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#7A7A7A',
    },
  });

export default PremiumModal;
