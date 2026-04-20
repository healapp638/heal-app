import { Platform, StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      width: '90%',
      alignSelf: 'center',
      paddingTop: Platform.OS === 'ios' ? 0 : 16,
    },
    logo: {
      height: 92,
      width: 190,
      alignSelf: 'center',
      marginTop: Platform.OS === 'ios' ? 100 : 80,
    },
    startImage: {
      width: 302,
      height: 76,
      marginTop: 60,
      alignSelf: 'center',
    },
    description: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      textAlign: 'center',
      marginTop: 20,
      color: colors.black,
    },
    starsImage: {
      height: 30,
      width: 170,
      alignSelf: 'center',
      marginTop: 60,
    },
    quote: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      textAlign: 'center',
      marginTop: 10,
      color: colors.black,
    },
    btn: {
      marginTop: Platform.OS === 'ios' ? 160 : 140,
    },
  });

export default style;
