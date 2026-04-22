import { StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: AppUtils.fontSize(25),
      fontFamily: AppFonts.recoMedium,
      color: colors.black,
      textAlign: 'center',
paddingHorizontal:2
    },
    btn: {
      bottom: 40,
      position: 'absolute',
    },
  });

export default style;
