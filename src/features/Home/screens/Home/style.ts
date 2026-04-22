import { Platform, StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: Platform.OS == 'ios' ? 4 : 10,
      paddingBottom: 120,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    userName: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
    },
    safeSpace: {
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.regular,
      color: colors.black,
    },
    calendarContainer: {
      marginBottom: 20,
    },
    headerRightText: {
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.regular,
      color: colors.brown,
    },
    sectionTitle: {
      fontSize: AppUtils.fontSize(22),
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      marginBottom: 15,
      marginTop: 20,
    },
    quoteBox: {
      backgroundColor: '#EBE0D0',
      borderRadius: 25,
      padding: 25,
      alignItems: 'center',
      marginBottom: 30,
      borderWidth: 1,
      borderColor: colors.primary + '20',
    },
    quoteText: {
      fontSize: AppUtils.fontSize(18),
      fontFamily: AppFonts.regular,
      color: colors.brown,
      textAlign: 'center',
      lineHeight: 26,
    },
    exploreMore: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.regular,
      color: colors.brown,
      marginTop: 15,
      opacity: 0.6,
    },
  });

export default style;
