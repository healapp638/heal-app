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
      paddingBottom: 150,
    },
    progressCardMargin: {
      marginBottom: Platform.OS === 'ios' ? 20 : 18,
      marginTop: Platform.OS === 'ios' ? 20 : 18,
    },
    sectionTitle: {
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.semiBold,
      includeFontPadding: false,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Platform.OS === 'ios' ? 12 : 10,
    },
    seeAllText: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.medium,
      color: colors.brown,
    },
    horizontalList: {
      marginHorizontal: -20,
      marginBottom: Platform.OS === 'ios' ? 20 : 18,
    },
    horizontalListContent: {
      paddingLeft: 20,
      paddingRight: 20,
    },
    themesList: {
      marginBottom: Platform.OS === 'ios' ? 10 : 8,
    },
  });

export default style;
