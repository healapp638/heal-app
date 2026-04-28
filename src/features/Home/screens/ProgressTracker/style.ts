import { StyleSheet, Platform } from 'react-native';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    journeyTitle: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      includeFontPadding: false,
      marginTop: -8,
    },
    journeySub: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.regular,
      color: colors.brown,
      lineHeight: 22,
      marginTop: 6,
      marginBottom: 10,
      includeFontPadding: false,
    },
    moduleList: {
      paddingBottom: 20,
    },
  });

export default style;
