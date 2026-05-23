import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 24,
      backgroundColor: '#F7F4EB', // Ensure consistent background color
    },
    content: {
      flex: 1,
      paddingTop: 20,
    },
    title: {
      fontFamily: AppFonts.recoMedium,
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
      marginBottom: 20,
      includeFontPadding: false,
    },
    inputLabel: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(13),
      color: colors.brown || '#3A2110',
      marginBottom: 8,
      marginLeft: 4,
    },
    inputContainer: {
      backgroundColor: '#FFFFFF',

      borderWidth: 1.5,
      borderColor: '#FFD1D1', // Coral/pinkish border to match mockup
      height: 54,
    },
    textInput: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown || '#3A2110',
    },
    footerContainer: {
      paddingBottom: Platform.OS === 'ios' ? 40 : 30,
      alignItems: 'center',
    },
    submitBtn: {
      backgroundColor: '#3A2110', // Dark brown button
      width: '100%',
      height: 54,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitBtnText: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: '#FFFFFF',
    },
  });

export default style;
