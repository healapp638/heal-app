import { Platform, StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import { hp } from '../../../../utils/dimension';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    heartRope: {
      width: 400,
      height: 77,
      alignSelf: 'center',
      marginBottom: hp(3),
      marginTop: Platform.OS === 'ios' ? 0 : 20,
    },
    title: {
      fontFamily: AppFonts.recoMedium,
      fontSize: AppUtils.fontSize(26),
      color: colors.brown,
      textAlign: 'center',
      lineHeight: AppUtils.fontSize(34),
      marginTop: hp(18),
      marginBottom: hp(1.5),
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(15),
      color: colors.brown,
      textAlign: 'center',
      lineHeight: AppUtils.fontSize(22),
      paddingHorizontal: 20,
      opacity: 0.8,
      marginBottom: hp(1),
    },
    inputContainer: {
      width: '100%',
      marginTop: hp(1),
    },
    inputStyle: {
      backgroundColor: colors.white,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 16,
      height: Platform.OS === 'ios' ? 56 : 52,
      paddingHorizontal: 16,
    },
    inputText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
    },
    btn: {
      width: '100%',
      alignSelf: 'center',
      height: Platform.OS === 'ios' ? 56 : 52,
      borderRadius: 100,
      backgroundColor: colors.brown,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Platform.OS === 'ios' ? 40 : 30,
      marginTop: hp(4),
    },
  });

export default style;
