import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 4 : 10,
      paddingBottom: 100,
    },
    headerTextContainer: {
      marginBottom: Platform.OS == 'ios' ? 12 : 8,
    },
    title: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.recoMedium,
      marginBottom: Platform.OS == 'ios' ? 12 : 8,
      includeFontPadding: false,
    },
    subtitle: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.regular,
      lineHeight: 22,
      includeFontPadding: false,
    },
    progressCardMargin: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.semiBold,
      marginBottom: 14,
      includeFontPadding: false,
    },
  });

export default style;
