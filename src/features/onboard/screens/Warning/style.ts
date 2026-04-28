import { Platform, StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import { hp } from '../../../../utils/dimension';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    heartRope: {
      width: '100%',
      height: 77,
      alignSelf: 'center',
      marginBottom: 80,
      marginTop: -16,
    },
    title: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(24),
      color: colors.brown,
      textAlign: 'center',
      marginBottom: 20,
      marginTop: 80,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      textAlign: 'center',
      paddingHorizontal: 15,
      lineHeight: 30,
    },
    btn: {
      position: 'absolute',
      bottom: 40,
    },
  });

export default style;
