import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { triggerHaptic } from '../hooks/useHaptic';
interface DailyWeeklyToggleProps {
  activeTab: 'daily' | 'weekly';
  onTabChange: (tab: 'daily' | 'weekly') => void;
  dailyLabel: string;
  weeklyLabel: string;
}
const DailyWeeklyToggle = ({
  activeTab,
  onTabChange,
  dailyLabel,
  weeklyLabel,
}: DailyWeeklyToggleProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          triggerHaptic('impactMedium');
          return onTabChange('daily');
        }}
        style={[
          styles.tab,
          activeTab === 'daily' ? styles.activeTab : styles.inactiveTab,
        ]}
      >
        <SolidText
          style={[
            styles.tabText,
            activeTab === 'daily'
              ? styles.activeTabText
              : styles.inactiveTabText,
          ]}
        >
          {dailyLabel}
        </SolidText>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          triggerHaptic('impactMedium');
          return onTabChange('weekly');
        }}
        style={[
          styles.tab,
          activeTab === 'weekly' ? styles.activeTab : styles.inactiveTab,
        ]}
      >
        <SolidText
          style={[
            styles.tabText,
            activeTab === 'weekly'
              ? styles.activeTabText
              : styles.inactiveTabText,
          ]}
        >
          {weeklyLabel}
        </SolidText>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: '#F7EDE1',
    // Pale light beige
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E7A189',
    marginTop: 10,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#E7A189', // Salmon color from screenshot
  },
  inactiveTab: {
    backgroundColor: 'rgb(241, 229, 218)', // Pale light beige
  },
  tabText: {
    fontSize: AppUtils.fontSize(16),
    fontFamily: AppFonts.medium,
  },
  activeTabText: {
    color: 'white',
  },
  inactiveTabText: {
    color: '#3A2110', // Dark brown
  },
});
export default DailyWeeklyToggle;
