import { StyleSheet, Platform } from 'react-native';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    welcomeContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 100, // Account for footer
    },
    logo: {
      width: 70,
      height: 70,
      marginBottom: 20,
    },
    welcomeText: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      textAlign: 'center',
      lineHeight: 28,
    },
    footerContainer: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 40 : 20,
      left: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    plusBtn: {},
    plusIcon: {
      width: 48,
      height: 48,
    },
    inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 30,
      height: 44,
      marginHorizontal: 12,
      paddingLeft: 20,
      paddingRight: 6,
      shadowColor: '#000000ff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    textInput: {
      flex: 1,
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.medium,
      color: colors.brown,
      paddingVertical: 0,
      includeFontPadding: false,
    },
    micIcon: {
      width: 22,
      height: 22,
      tintColor: colors.brown,
      marginLeft: 10,
    },
    listenBtn: {},
    listenIcon: {
      width: 32,
      height: 32,
      marginLeft: 4,
    },
    sidebarBtn: {
      padding: 10,
    },
    sidebarIcon: {
      width: 24,
      height: 24,
      tintColor: colors.brown,
    },
  });

export default style;
