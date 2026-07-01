import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    numberText: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(195),
      color: '#EBA187', // Peach color matching the screenshot
      includeFontPadding: false,
      marginTop: -100,
    },
    descriptionText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(17),
      color: colors.brown,
      textAlign: 'center',
      lineHeight: 26,
      marginTop: Platform.OS == 'ios' ? -40 : -50,
      paddingHorizontal: 10,
      width: '80%',
    },
    bottomContainer: {
      marginBottom: Platform.OS === 'ios' ? 40 : 20,
      width: '100%',
    },
    nextButton: {
      width: '90%',
      marginBottom: 40,
    },
  });

export default style;
