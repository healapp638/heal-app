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
    title: {
      fontSize: AppUtils.fontSize(25),

      textAlign: 'center',
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      marginTop: Platform.OS == 'ios' ? 20 : 30,
      paddingHorizontal: 10,
      includeFontPadding: false,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(15),
      color: colors.brown,
      alignSelf: 'center',
      marginVertical: 10,
      includeFontPadding: false,
    },
    image: {
      width: 350,
      height: 320,
      marginTop: hp(11),
      alignSelf: 'center',
    },
    btn: {
      bottom: 40,
      position: 'absolute',
    },
  });

export default style;
