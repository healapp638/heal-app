import { StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    warningText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: '#E53E3E',
      lineHeight: 20,
      marginVertical: 20,
      includeFontPadding: false,
    },
    deleteBtn: {
      backgroundColor: '#E53E3E',
      width: '90%',
      borderRadius: 100,
      marginTop: 30,
      marginBottom: 60,
    },
  });

export default style;
