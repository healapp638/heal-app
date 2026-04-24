import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    helpTitle: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(32),
      color: colors.brown,
      marginTop: Platform.OS == 'ios' ? -10 : -12,
      includeFontPadding: false,
    },
    helpSubtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginTop: 4,
      marginBottom: 20,
      includeFontPadding: false,
    },
    heroCard: {
      backgroundColor: 'rgba(241,226,216)',
      borderRadius: 12,
      padding: 12,
      marginBottom: Platform.OS == 'ios' ? 12 : 14,
    },
    heroTitle: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: 12,
      includeFontPadding: false,
    },
    heroDesc: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      lineHeight: 22,
      includeFontPadding: false,
    },
    countryTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: Platform.OS == 'ios' ? 12 : 10,
      marginTop: 4,
      includeFontPadding: false,
    },
    resourceCard: {
      backgroundColor: 'rgba(160, 115, 98, 0.2)',
      borderRadius: 16,
      padding: 12,
      marginBottom: 20,
    },
    resourceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    resourceInfo: {
      flex: 1,
    },
    resourceTitle: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: 4,
      includeFontPadding: false,
    },
    resourceStatus: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      opacity: 0.7,
      includeFontPadding: false,
      marginTop: Platform.OS == 'ios' ? 6 : 4,
      marginBottom: Platform.OS == 'ios' ? 6 : 4,
    },
    callIcon: {
      width: 18,
      height: 18,
      tintColor: colors.brown,
      marginTop: 8,
    },
    callButton: {
      backgroundColor: colors.brown,
      borderRadius: 100,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%',
      alignSelf: 'center',
      marginBottom: 4,
    },
    callButtonText: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: colors.white,
      includeFontPadding: false,
    },
    additionalSection: {
      marginBottom: 40,
    },
    linkCard: {
      backgroundColor: 'rgba(249,172,144,0.2)',
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    linkText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      includeFontPadding: false,
    },
    openIcon: {
      width: 18,
      height: 18,
      tintColor: colors.brown,
      opacity: 0.7,
    },
  });

export default style;
