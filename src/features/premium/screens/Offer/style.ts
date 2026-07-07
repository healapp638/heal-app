import { StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import { hp } from '../../../../utils/dimension';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 120,
    },
    title: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      textAlign: 'center',
      paddingHorizontal: 15,
    },
    priceHeader: {
      fontSize: AppUtils.fontSize(36),
      fontFamily: AppFonts.recoBold,
      color: colors.brown,
      textAlign: 'center',
      fontWeight: '700',
    },
    btn: {
      bottom: 40,
      position: 'absolute',
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
