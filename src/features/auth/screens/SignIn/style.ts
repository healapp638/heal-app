import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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

      marginBottom: hp('4%'),
      lineHeight: 24,
      includeFontPadding: false,
    },
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Platform.OS == 'ios' ? -8 : -10,
      marginBottom: hp('4%'),
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkboxImage: {
      width: 20,
      height: 20,
      marginRight: 8,
    },
    rememberMeText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(13),
      color: colors.brown,
    },
    forgotPasswordText: {
      fontSize: AppUtils.fontSize(13),
      color: colors.primary,
      fontStyle: 'italic',
      fontWeight: Platform.OS == 'ios' ? '700' : '600',
    },
    loginBtn: {
      backgroundColor: colors.brown,
      borderRadius: 100,
      marginTop: 0,
      marginBottom: 0,
      width: '100%',
    },
    loginRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginBottom: hp('4%'),
    },
    bioContainer: {
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    bioIcon: {
      height: Platform.OS === 'ios' ? 54 : 50,
      width: Platform.OS === 'ios' ? 54 : 50,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp('3%'),
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
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',

      paddingBottom: Platform.OS === 'ios' ? 20 : 10,
      marginTop: 20,
    },
    footerText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      includeFontPadding: false,
    },
    signUpText: {
      fontSize: AppUtils.fontSize(14),
      color: colors.primary,
      marginLeft: 5,
      fontStyle: 'italic',
      fontWeight: Platform.OS == 'ios' ? '700' : '600',
      includeFontPadding: false,
    },
  });

export default style;
