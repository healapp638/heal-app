import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: 'center'
    },
    numberText: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(195),
      color: '#EBA187', // Peach color matching the screenshot
      includeFontPadding: false,
      marginTop: -20

    },
    descriptionText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(17),
      color: colors.brown,
      textAlign: 'center',
      lineHeight: 28,
      paddingHorizontal: 10
    },
    pinkText: {
      color: '#F66F76',
    },
    reflectionCard: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 14,
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 5,
      // Android shadow
      elevation: 2,
    },
    reflectionTitle: {
      fontFamily: AppFonts.recoSemiBold,
      fontSize: AppUtils.fontSize(18),
      color: '#EBA187',
      marginBottom: Platform.OS == 'ios' ? 10 : 8,
    },
    reflectionQuestion: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      marginBottom: Platform.OS == 'ios' ? 10 : 8,

      lineHeight: Platform.OS == 'ios' ? 23 : 21,
    },
    reflectionInstruction: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#909090',
      marginBottom: Platform.OS == 'ios' ? 14 : 12,
      lineHeight: Platform.OS == 'ios' ? 21 : 19,
    },
    textInput: {
      width: '100%',
      height: 170,
      backgroundColor: '#F9F4EE', // light beige
      borderRadius: 12,
      borderWidth: 2,
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      textAlignVertical: 'top',
      includeFontPadding: false,
      paddingLeft: Platform.OS == 'ios' ? 10 : 10,
      lineHeight: Platform.OS == 'ios' ? 21 : 19,
      borderColor: '#EAAC901A',
    },
    nextButton: {
      width: '90%',
      marginBottom: 40,
    },
    scrollContent: {
      width: '100%',
      paddingBottom: 30,
      alignItems: 'center',
    },
    exerciseTitle: {
      fontFamily: AppFonts.recoSemiBold,
      fontSize: AppUtils.fontSize(17),
      color: colors.brown,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 28,
      includeFontPadding: false,
      marginTop: -40
    },
    exerciseDescription: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(13),
      color: '#3A2110',
      textAlign: 'left',
      lineHeight: 26,

      marginBottom: 30,
      includeFontPadding: false,
    },
    optionList: {
      width: '100%',
      paddingHorizontal: 5,
      marginBottom: 30,
    },
    optionCard: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 14,
      padding: 16,
      borderWidth: 1.5,
      borderColor: '#EFEFEF',
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 2,
    },
    optionCardSelected: {
      borderColor: colors.brown,
      backgroundColor: 'white',
    },
    optionText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      includeFontPadding: false,
    },
    optionTextSelected: {
      fontFamily: AppFonts.medium,
      color: colors.brown,
    },
  });

export default style;
