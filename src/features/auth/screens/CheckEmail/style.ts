import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 24,
      backgroundColor: '#F7F4EB', // Match off-white background
    },
    content: {
      flex: 1,
      paddingTop: 40,
    },
    title: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(28),
      color: colors.brown || '#3A2110',
      textAlign: 'center',
      marginBottom: 12,
      includeFontPadding: false,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(15),
      color: colors.brown || '#3A2110',
      textAlign: 'center',
      lineHeight: 22,
      opacity: 0.8,
      marginBottom: 40,
      includeFontPadding: false,
      paddingHorizontal: 10,
    },
    boldText: {
      fontFamily: AppFonts.semiBold,
      color: colors.brown || '#3A2110',
    },
    footerContainer: {
      paddingBottom: Platform.OS === 'ios' ? 40 : 30,
      alignItems: 'center',
      width: '100%',
    },
    submitBtn: {
      backgroundColor: '#3A2110', // Dark brown button
      width: '100%',
      height: 54,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    submitBtnText: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: '#FFFFFF',
    },
    timerText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown || '#3A2110',
      opacity: 0.7,
    },
    resendLink: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown || '#3A2110',
      textDecorationLine: 'underline',
    },
  });

export default style;
