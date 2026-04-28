import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    welcomeTitle: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(22),
      color: colors.brown,
      textAlign: 'center',
      marginBottom: 8,
      includeFontPadding: false,
    },
    welcomeSubtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      textAlign: 'center',
      marginBottom: hp('3%'),
      lineHeight: 24,
      includeFontPadding: false,
    },
    formContainer: {
      width: '100%',
    },
    completeBtn: {
      backgroundColor: colors.brown,
      width: '90%',
      borderRadius: 100,
      marginTop: hp('4%'),
      alignSelf: 'center',
    },
  });

export default style;
