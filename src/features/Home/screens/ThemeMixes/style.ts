import { StyleSheet, Platform } from 'react-native';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    contentPadding: {
      paddingHorizontal: 20,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Platform.OS === 'ios' ? 10 : 20,
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    backIcon: {
      width: 14,
      height: 14,
      tintColor: colors.brown,
    },
    unlockBtn: {
      paddingHorizontal: 16,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: '#3A2110',
    },
    unlockText: {
      color: 'white',
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.medium,
      includeFontPadding: false,
    },
    title: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      marginBottom: 6,
      paddingHorizontal: 20,
    },
    categoryList: {
      marginBottom: Platform.OS == 'ios' ? 20 : 18,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Platform.OS === 'ios' ? 10 : 6,
    },
    sectionTitle: {
      fontSize: AppUtils.fontSize(18),
      fontFamily: AppFonts.semiBold,
      color: colors.brown,
    },
    seeAllText: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.medium,
      color: '#F46F76', // Primary pink/red accent
    },
    mixesList: {
      marginBottom: 20,
    },
    gridList: {
      paddingBottom: 40,
    },
  });

export default style;
