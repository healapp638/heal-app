import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: AppUtils.fontSize(23),
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      marginBottom: 6,
      includeFontPadding: false,
      marginTop: -10,
    },
    headerSubtitle: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.medium,
      color: '#5F4437',
      marginBottom: 20,
      includeFontPadding: false,
    },
    accordionCard: {
      backgroundColor: 'rgba(234,172,144,0.17)',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    accordionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    accordionTitle: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.semiBold,
      color: colors.brown,
      flex: 1,
      marginRight: 10,
    },
    accordionIcon: {
      width: 14,
      height: 14,
      tintColor: colors.brown,
    },
    accordionBody: {
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.regular,
      color: colors.brown,
      marginTop: 12,
      lineHeight: 22,
    },
    feedbackCard: {
      backgroundColor: '#EAE0D5',
      borderRadius: 16,
      padding: 10,
      marginTop: 10,
      marginBottom: 20,
    },
    feedbackTitle: {
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.semiBold,
      color: colors.brown,
      marginBottom: 8,
    },
    feedbackSubtitle: {
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.medium,
      color: '#5F4437',
      lineHeight: 22,
    },
    inputLabel: {
      fontSize: AppUtils.fontSize(13),
      fontFamily: AppFonts.medium,
      color: colors.brown,
      marginBottom: 6,
    },
    messageContainer: {
      backgroundColor: colors.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#EAE0D5',
      paddingHorizontal: 10,
      // paddingVertical: Platform.OS === 'ios' ? 12 : 8,
      minHeight: 120,
      marginBottom: 20,
    },
    messageInput: {
      flex: 1,
      color: colors.brown,
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(15),
      textAlignVertical: 'top',
    },
    sendFeedbackBtn: {
      width: '90%',
      backgroundColor: colors.brown,
      borderRadius: 100,
      marginBottom: 60,
    },
  });

export default style;
