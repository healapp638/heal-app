import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    // Month navigation row
    monthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.calendarPill,
      borderRadius: 999,
      paddingHorizontal: 18,
      height: Platform.OS === 'ios' ? 55 : 50,
      marginBottom: 16,
    },
    monthNavBtn: {
      padding: 6,
    },
    monthNavIcon: {
      width: 11,
      height: 11,
      tintColor: colors.calendarNavBrown,
    },
    monthLabel: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: colors.calendarNavBrown,
      includeFontPadding: false,
    },
  });

export default style;
