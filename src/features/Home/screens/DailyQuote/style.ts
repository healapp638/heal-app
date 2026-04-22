import { StyleSheet, Platform } from 'react-native';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';

const style = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    quoteContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    quoteText: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.reco,
      color: '#3A2110',
      textAlign: 'center',
      lineHeight: 36,
      includeFontPadding: false,
    },
    footerContainer: {
      paddingBottom: Platform.OS === 'ios' ? 90 : 80,
      alignItems: 'center',
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBtn: {
      padding: 12,
      marginHorizontal: 8,
    },
    bottomIcon: {
      width: 24,
      height: 24,
      tintColor: '#3A2110',
    },
    themeBtn: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 40 : 30,
      right: 0,
    },
    themeIcon: {
      width: 50,
      height: 50,
    },
  });

export default style;
