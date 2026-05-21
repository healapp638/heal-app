import { Platform, StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import { hp } from '../../../../utils/dimension';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    heartRope: {
      width: 400,
      height: 77,
      alignSelf: 'center',
      marginBottom: 50,
      marginTop: Platform.OS === 'ios' ? 0 : 20,
    },
    title: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(24),
      color: colors.brown,
      textAlign: 'center',
      lineHeight: AppUtils.fontSize(32),
      marginTop: hp(18),
      paddingHorizontal: 16,
    },
    btn: {
      position: 'absolute',
      bottom: 40,
    },
  });

export default style;
