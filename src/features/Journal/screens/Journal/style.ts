import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: Platform.OS == 'ios' ? 4 : 10,
    },

    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Platform.OS == 'ios' ? 24 : 20,
      marginBottom: 24,
    },
    searchBox: {
      flex: 1,
      height: Platform.OS == 'ios' ? 40 : 36,
      backgroundColor: '#E4D9D0',
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginRight: 12,
    },
    searchIcon: {
      width: 16,
      height: 16,
      tintColor: colors.brown,
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      padding: 0,
      includeFontPadding: false,
    },
    calendarBtn: {
      width: Platform.OS == 'ios' ? 40 : 36,
      height: Platform.OS == 'ios' ? 40 : 36,
      backgroundColor: '#E4D9D0',
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarIcon: {
      width: Platform.OS == 'ios' ? 18 : 16,
      height: Platform.OS == 'ios' ? 18 : 16,
      tintColor: colors.brown,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 40,
    },
    bigJournalIcon: {
      width: 90,
      height: 90,
      marginBottom: Platform.OS == 'ios' ? 14 : 12,
      marginTop: Platform.OS == 'ios' ? 100 : 90,
    },
    welcomeTitle: {
      fontFamily: AppFonts.recoMedium,
      fontSize: AppUtils.fontSize(24),
      color: colors.brown,
      marginBottom: Platform.OS == 'ios' ? 8 : 4,
    },
    welcomeDesc: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      textAlign: 'center',
      lineHeight: 20,
    },
    dateTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: 16,
    },
    listContent: {
      paddingBottom: 100,
    },
    fab: {
      position: 'absolute',
      bottom: Platform.OS == 'ios' ? 114 : 94,
      right: 10,
    },
    bigPlusIcon: {
      width: 70,
      height: 70,
    },
  });

export default style;
