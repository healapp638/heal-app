import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import { hp } from '../../../../utils/dimension';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },

    backImage: {
      width: 24,
      height: 24,
      tintColor: colors.brown,
    },
    headerText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
    },
    logo: {
      width: 180,
      height: 92,
      marginBottom: 20,
      marginTop: Platform.OS == 'ios' ? 50 : 40,
    },
    title: {
      fontFamily: AppFonts.recoMedium,
      fontSize: AppUtils.fontSize(26),
      color: colors.brown,
      textAlign: 'center',
      marginBottom: 12,
      includeFontPadding: false,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      textAlign: 'center',
      includeFontPadding: false,
      paddingHorizontal: 20,
      marginBottom: 30,
    },
    socialButtonsContainer: {
      width: '100%',
marginTop:Platform.OS=='ios'?  hp(4):hp(8)
    },
    socialBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      height: Platform.OS === 'ios' ? 70 : 60,
      borderRadius: 100,
      width: '90%',
      marginBottom: Platform.OS == 'ios' ? 20 : 18,
      alignSelf: 'center',

      borderWidth: 0.5,
      borderColor: colors.border,
    },
    socialIcon: {
      width: 25,
      height: 25,
      marginRight: 10,
    },
    socialBtnTxt: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(15),
      color: colors.brown,
      includeFontPadding: false,
    },
    bottomButtonsContainer: {
      width: '100%',
      marginBottom: 10,
    },
    loginBtn: {
      backgroundColor: colors.brown,
      marginTop: 0,
      marginBottom: 20,
    },
    createAccountBtn: {
      backgroundColor: colors.primary,
      marginTop: 0,
      marginBottom: 10,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
marginBottom: 20
    },
    footerText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      opacity: 0.8,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.brown,
      marginHorizontal: 8,
      opacity: 0.8,
    },
  });

export default style;
