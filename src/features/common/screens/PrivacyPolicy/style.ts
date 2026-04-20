import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    content: {
      paddingBottom: 40,
    },
    text: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.black,
      lineHeight: 22,
      marginBottom: 20,
    },
  });

export default style;
