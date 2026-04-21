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
      color: colors.black,
      textAlign: 'center',

      marginBottom: hp('3%'),
      lineHeight: 24,
      includeFontPadding: false,
    },
    formContainer: {
      width: '100%',
    },
    signUpBtn: {
      backgroundColor: colors.brown,
      width: '90%',
      borderRadius: 100,
      marginTop: hp('2%'),
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp('4%'),
      paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    footerText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.black,
      includeFontPadding: false,
    },
    signInText: {
      fontSize: AppUtils.fontSize(14),
      color: colors.primary,
      marginLeft: 5,
      fontStyle: 'italic',
      fontWeight: Platform.OS === 'ios' ? '700' : '600',
      includeFontPadding: false,
    },
  });

export default style;
