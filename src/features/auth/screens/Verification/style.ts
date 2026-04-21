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
    timerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: -10,
      marginBottom: hp('4%'),
      paddingHorizontal: 5,
    },
    timerText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(13),
      color: colors.black,
    },
    resendText: {

      fontSize: AppUtils.fontSize(13),
      color: colors.primary,
fontStyle:'italic',
      fontWeight: Platform.OS === 'ios' ? '700' : '600',
    },
    verifyBtn: {
      backgroundColor: colors.brown,
      width: '90%',
      borderRadius: 100,
marginTop:20,
marginBottom:60,

      alignSelf: 'center',
    },
  });

export default style;
