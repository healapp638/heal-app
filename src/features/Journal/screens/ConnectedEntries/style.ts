import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontFamily: AppFonts.recoSemiBold,
      fontSize: AppUtils.fontSize(28),
      color: colors.brown,
      marginTop: 20,
      marginBottom: 4,
      includeFontPadding: false,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: 24,
      includeFontPadding: false,
    },
    listContent: {
      paddingBottom: 40,
    },
  });

export default style;
