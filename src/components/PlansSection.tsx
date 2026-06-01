import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import SolidText from './SolidText';
import { triggerHaptic } from '../hooks/useHaptic';
interface PlansSectionProps {
  localization: any;
  styles: any;
  selectedPlan: 'monthly' | 'yearly';
  setSelectedPlan: (plan: 'monthly' | 'yearly') => void;
}
const PlansSection: React.FC<PlansSectionProps> = ({
  localization,
  styles,
  selectedPlan,
  setSelectedPlan,
}) => {
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
        <SolidText maxFontScale={1} style={styles.planPrice}>
          {localization.appkeys?.monthlyPrice}
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
        <SolidText maxFontScale={1} style={styles.planPrice}>
          {localization.appkeys?.yearlyPrice}
        </SolidText>
        <SolidText maxFontScale={1} style={styles.planFreeTrial}>
          {localization.appkeys?.threeDaysFree}
        </SolidText>
      </TouchableOpacity>
    </View>
  );
};
export default PlansSection;
