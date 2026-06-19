import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import SolidText from './SolidText';
import { triggerHaptic } from '../hooks/useHaptic';
interface PlansSectionProps {
  localization: any;
  styles: any;
  selectedPlan: 'monthly' | 'yearly';
  setSelectedPlan: (plan: 'monthly' | 'yearly') => void;
  monthlyPrice?: string;
  yearlyPrice?: string;
  appLanguage?: string;
}

const parsePrice = (priceStr: string | undefined, defaultPrice: string) => {
  const str = priceStr || defaultPrice;
  if (!str) return { amount: '', period: '' };

  const parts = str.split('/');
  if (parts.length >= 2) {
    const amount = parts[0].trim();
    const period = parts[1].trim();
    return { amount, period };
  }
  return { amount: str, period: '' };
};

const getPeriodText = (appLanguage: string, type: 'month' | 'year') => {
  const lang = (appLanguage || 'English').toLowerCase();
  if (type === 'month') {
    switch (lang) {
      case 'french':
        return 'par mois';
      case 'spanish':
        return 'por mes';
      case 'german':
        return 'pro Monat';
      case 'portuguese':
        return 'por mês';
      case 'italian':
        return 'al mese';
      case 'russian':
        return 'в месяц';
      default:
        return 'per month';
    }
  } else {
    switch (lang) {
      case 'french':
        return 'par an';
      case 'spanish':
        return 'por año';
      case 'german':
        return 'pro Jahr';
      case 'portuguese':
        return 'por ano';
      case 'italian':
        return "all'anno";
      case 'russian':
        return 'в год';
      default:
        return 'per year';
    }
  }
};

const PlansSection: React.FC<PlansSectionProps> = ({
  localization,
  styles,
  selectedPlan,
  setSelectedPlan,
  monthlyPrice,
  yearlyPrice,
  appLanguage = 'English',
}) => {
  const monthlyData = parsePrice(
    monthlyPrice,
    localization.appkeys?.monthlyPrice,
  );
  const yearlyData = parsePrice(yearlyPrice, localization.appkeys?.yearlyPrice);

  return (
    <View style={styles.plansContainer}>
      <TouchableOpacity
        style={[
          styles.planCard,
          selectedPlan === 'monthly' && styles.activePlanCard,
        ]}
        onPress={() => {
          return setSelectedPlan('monthly');
        }}
      >
        <SolidText maxFontScale={1} style={styles.planLabel}>
          {localization.appkeys?.monthly}
        </SolidText>
        <SolidText maxFontScale={1} style={styles.planPriceAmount}>
          {monthlyData.amount}
        </SolidText>
        <SolidText maxFontScale={1} style={styles.planPricePeriod}>
          {getPeriodText(appLanguage, 'month')}
        </SolidText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.planCard,
          selectedPlan === 'yearly' && styles.activePlanCard,
        ]}
        onPress={() => {
          return setSelectedPlan('yearly');
        }}
      >
        <View style={styles.badge}>
          <SolidText maxFontScale={1} style={styles.badgeText}>
            {localization.appkeys?.save60}
          </SolidText>
        </View>
        <SolidText maxFontScale={1} style={styles.planLabel}>
          {localization.appkeys?.yearly}
        </SolidText>
        <SolidText maxFontScale={1} style={styles.planPriceAmount}>
          {yearlyData.amount}
        </SolidText>
        <SolidText maxFontScale={1} style={styles.planPricePeriod}>
          {`${getPeriodText(appLanguage, 'year')} `}
        </SolidText>
      </TouchableOpacity>
    </View>
  );
};
export default PlansSection;
