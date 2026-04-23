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
      color: colors.black,
      marginBottom: Platform.OS == 'ios' ? 14 : 12,
      includeFontPadding: false,
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Platform.OS == 'ios' ? 24 : 20,
    },
    circleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleActive: {
      width: 38,
      height: 38,
      borderRadius: 22,
      backgroundColor: '#F66F76',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: 'rgb(233,145,147)',
    },
    circleInactive: {
      width: 38,
      height: 38,
      borderRadius: 22,
      backgroundColor: 'white',
      borderWidth: 1.5,
      borderColor: '#D1D1D1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    circleTextActive: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(18),
      color: 'white',
      includeFontPadding: false,
    },
    circleTextInactive: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(18),
      color: '#909090',
      includeFontPadding: false,
    },
    line: {
      width: 24,
      height: 5,
      backgroundColor: '#D1D1D1',
      marginHorizontal: -2,
    },
    lineActive: {
      backgroundColor: '#F66F7655', // slightly faded pink
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
