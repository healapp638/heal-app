import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 4 : 10,
      paddingBottom: 100,
    },
    progressCardMargin: {
      marginBottom: Platform.OS === 'ios' ? 20 : 18,
      marginTop: Platform.OS === 'ios' ? 20 : 18,
    },
    sectionTitle: {
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.semiBold,
      marginBottom: Platform.OS === 'ios' ? 14 : 12,
      includeFontPadding: false,
    },
    horizontalList: {
      marginHorizontal: -20, // To allow scrolling edge-to-edge
      marginBottom: Platform.OS === 'ios' ? 20 : 18,
      padding: 2,
    },
    horizontalListContent: {
      paddingHorizontal: 20,
      paddingRight: 10,
    },
    themesList: {
      marginBottom: Platform.OS === 'ios' ? 10 : 8,
    },
  });

export default style;
