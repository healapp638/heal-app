import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import SolidText from './SolidText';

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
  );
};

export default PlansSection;
