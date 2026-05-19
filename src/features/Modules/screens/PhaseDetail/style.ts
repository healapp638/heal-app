import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontFamily: AppFonts.recoSemiBold,
      fontSize: AppUtils.fontSize(18),
      marginBottom: Platform.OS == 'ios' ? 6 : 4,
      includeFontPadding: false,
      marginTop: -20,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      marginBottom: Platform.OS == 'ios' ? 14 : 12,
      includeFontPadding: false,
    },
    cardContainer: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 10,
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 5,
      // Android shadow
      elevation: 2,
    },
    cardTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: Platform.OS == 'ios' ? 11 : 7,

      includeFontPadding: false,
    },
    cardText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#606060',
      lineHeight: 22,
      marginBottom: Platform.OS == 'ios' ? 10 : 8,

      includeFontPadding: false,
    },
    innerCard: {
      backgroundColor: '#F7EFE8', // light peach/beige
      borderRadius: 16,
      padding: 10,
    },
    innerCardTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      marginBottom: 8,
      includeFontPadding: false,
    },
    innerCardText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#505050',
      lineHeight: 22,
      includeFontPadding: false,
    },
    startButton: {
      marginBottom: 40,
    },
  });

export default style;
