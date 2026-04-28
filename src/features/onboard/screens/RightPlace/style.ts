import { Platform, StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    heartRope: {
      width: 400,
      height: 77,
      alignSelf: 'center',
      marginBottom: 50,
      marginTop: Platform.OS == 'ios' ? 0 : 20,
    },
    logo: {
      width: 180,
      height: 92,
      marginBottom: Platform.OS == 'ios' ? 120 : 130,
    },
    title: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(22),
      color: colors.brown,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    btn: {
      position: 'absolute',
      bottom: 40,
    },
  });

export default style;
