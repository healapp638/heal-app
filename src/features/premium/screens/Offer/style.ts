import { Platform, StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import { hp } from '../../../../utils/dimension';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    headerWrapper: {
      position: 'absolute',
      top: 0,
      width: '100%',

      zIndex: 999,
    },
    title: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      textAlign: 'center',
      paddingHorizontal: 30,
      includeFontPadding: false,
      marginTop: Platform.OS=='ios'?0:4,
    },
    priceHeader: {
      fontSize: AppUtils.fontSize(36),
      fontFamily: AppFonts.recoBold,
      color: colors.brown,
      textAlign: 'center',
      fontWeight: '700',
    },
    btn: {
position: 'absolute',
      bottom: 20,
      width: '80%',

    },
    infoText: {
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.regular,
      color: colors.brown,
      opacity: 0.7,
      textAlign: 'center',
      paddingHorizontal: 30,
      bottom: 115,
      position: 'absolute',
    },
  });

export default style;
