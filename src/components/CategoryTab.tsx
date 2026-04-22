import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface CategoryTabProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
  isCreate?: boolean;
}

const CategoryTab = ({
  title,
  isActive,
  onPress,
  isCreate,
}: CategoryTabProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tab,
        isActive && styles.activeTab,
        isCreate && styles.createTab,
      ]}
    >
      {isCreate && (
        <SolidText style={[styles.plusText, styles.createTabText]}>
          {'+'}
        </SolidText>
      )}
      <SolidText
        style={[
          styles.tabText,
          isActive && styles.activeTabText,
          isCreate && styles.createTabText,
        ]}
      >
        {title}
      </SolidText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: 16,
    height: 30,
    borderRadius: 22,
    backgroundColor: 'rgb(213,203,193)', // Muted brown/gray
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  activeTab: {
    backgroundColor: '#604033', // Dark brown
  },
  createTab: {
    backgroundColor: 'rgb(213,203,193)', // Same as others
  },
  tabText: {
    fontSize: AppUtils.fontSize(14),
    fontFamily: AppFonts.medium,
    color: '#604033',
    textTransform: 'capitalize',
    includeFontPadding: false,
  },
  activeTabText: {
    color: 'white',
    includeFontPadding: false,
  },
  createTabText: {
    color: '#604033',
    fontFamily: AppFonts.medium,
    includeFontPadding: false,
  },
  plusText: {
    fontSize: AppUtils.fontSize(28),
    includeFontPadding: false,

    marginTop: Platform.OS === 'ios' ? 0 : -1, // Adjust for high baseline of large Font
    fontFamily: AppFonts.regular,
  },
});

export default CategoryTab;
