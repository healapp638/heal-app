import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 4 : 10,
      paddingBottom: 100,
    },
    headerTextContainer: {
      marginBottom: Platform.OS == 'ios' ? 12 : 8,
    },
    title: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.recoMedium,
      marginBottom: Platform.OS == 'ios' ? 12 : 8,
      includeFontPadding: false,
    },
    subtitle: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.regular,
      lineHeight: 22,
      includeFontPadding: false,
    },
    progressCardMargin: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.semiBold,
      marginBottom: 14,
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
  });

export default style;
