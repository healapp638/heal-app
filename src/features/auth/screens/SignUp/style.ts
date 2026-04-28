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
      color: colors.brown,
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
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp('3%'),
      marginTop: hp('2%'),
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.primary,
      opacity: 0.3,
    },
    dividerText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(13),
      color: colors.brown,
      marginHorizontal: 10,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: Platform.OS == 'ios' ? 'space-between' : 'center',
      width: '100%',
    },
    socialBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      height: Platform.OS === 'ios' ? 52 : 50,
      borderRadius: 100,
      width: '48%',
      borderWidth: 1,
      borderColor: colors.border,
    },
    socialIcon: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
    socialBtnTxt: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(15),
      color: colors.brown,
      includeFontPadding: false,
    },
  });

export default style;
