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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoH: {
      height: 30,
      width: 30,
    },
    languagePill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#EBD8C9',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 100,
    },
    flagIcon: {
      width: 24,
      height: 16,
      marginRight: 8,
    },
    langCode: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      includeFontPadding: false,
    },
    phoneImage: {
      height: 470,
      width: 230,
      alignSelf: 'center',
      marginTop: 38,
    },
    title: {
      fontSize: AppUtils.fontSize(26),
      textAlign: 'center',
      marginTop: 20,
      fontFamily: AppFonts.reco,
      color: colors.brown,
      includeFontPadding: false,
    },
    btn: {
      marginTop: 30,
    },
    footerText: {
      fontSize: AppUtils.fontSize(14),
      textAlign: 'center',
      fontFamily: AppFonts.regular,
      color: colors.brown,
      includeFontPadding: false,
      marginBottom: 30
    },
    signInText: {
      color: colors.brown,
      fontStyle: 'italic',
      fontSize: AppUtils.fontSize(14),
      fontWeight: Platform.OS === 'ios' ? '600' : '800',
    },
  });

export default style;
