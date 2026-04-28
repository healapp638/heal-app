import { StyleSheet, Platform } from 'react-native';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';

const style = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 4 : 10,
      paddingBottom: 120,
    },
    bigStreak: {
      width: 120,
      height: 227,
      marginTop: 20,
      alignSelf: 'center',
    },
    quoteText: {
      fontFamily: AppFonts.reco,
      color: colors.brown,
      fontSize: AppUtils.fontSize(22),
      textAlign: 'center',
      lineHeight: 32,
      marginTop: 20,
    },
    buildStreakText: {
      alignSelf: 'center',
      fontFamily: AppFonts.regular,
      color: colors.brown,
      fontSize: AppUtils.fontSize(14),
      marginTop: 20,
    },
    continueBtn: {
      marginTop: 30,
    },
  });

export default style;
