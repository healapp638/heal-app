import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    subtitle: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(21),
      color: colors.black,
      textAlign: 'center',
      marginTop: 2,
      marginBottom: 20,
      lineHeight:Platform.OS=='ios'?30: 28,
      includeFontPadding: false,
    },
    listContent: {
      paddingBottom: 100,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 14,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: 'transparent',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    selectedCard: {
      borderColor: colors.primary,
    },
    flag: {
      width: 40,
      height: 28,
      marginRight: 16,
    },
    langName: {
      flex: 1,
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      color: colors.black,
      includeFontPadding: false,
    },
    checkIcon: {
      width: 24,
      height: 24,
    },
    footerBtn: {
      position: 'absolute',
      bottom: 20,
  
      backgroundColor: colors.brown,
      borderRadius: 100,
    },
  });

export default style;
