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
    },
    headerSubtitle: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.regular,
      color: colors.brown,
      marginBottom: 20,
      includeFontPadding: false,
    },
    sectionTitle: {
      fontSize: AppUtils.fontSize(18),
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      marginBottom: 4,
      includeFontPadding: false,
    },
    sectionTitleManagement: {
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.semiBold,
      color: colors.brown,
      marginTop: Platform.OS == 'ios' ? 17 : 15,
      marginBottom: Platform.OS == 'ios' ? 16 : 14,
      includeFontPadding: false,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 10,
      marginBottom: Platform.OS == 'ios' ? 20 : 18,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#FEF0F1', // Light pink background for icons
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: colors.primary, // The red color for icons
    },
    securityLevelTitle: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.medium,
      color: colors.black,
      includeFontPadding: false,
    },
    securityLevelSubtitle: {
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.regular,
      color: colors.brown,
      marginTop: 4,
      includeFontPadding: false,
    },
    securityLevelDesc: {
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.regular,
      color: colors.brown,
      marginTop: 16,
      lineHeight: 20,
      includeFontPadding: false,
    },
    settingItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    settingItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingItemTextContainer: {
      flex: 1,
      marginRight: 12,
    },
    settingItemTitle: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.medium,
      color: colors.black,
      includeFontPadding: false,
    },
    settingItemSubtitle: {
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.regular,
      color: colors.brown,
      marginTop: 4,
      includeFontPadding: false,
    },
    toggleIcon: {
      width: 44,
      height: 24,
    },
    changePassCard: {
      backgroundColor: 'rgba(234,172,144,0.17)', // cardBeige
      borderRadius: 22,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',

      marginBottom: 8,
      paddingVertical: Platform.OS == 'ios' ? 13 : 12,
    },
    changePassLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    changePassIconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    changePassTitle: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.medium,
      color: colors.brown,
      includeFontPadding: false,
    },
    arrowIcon: {
      width: 16,
      height: 16,
      tintColor: colors.brown,
    },
    managementCard: {
      backgroundColor: 'rgba(246,111,118,0.2)',
      borderRadius: 22,
      marginBottom: 12,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS == 'ios' ? 13 : 12,
    },
    managementTitle: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.semiBold,
      color: colors.primary,
      includeFontPadding: false,
    },
    managementSubtitle: {
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.regular,
      color: colors.primary,
      marginTop: Platform.OS == 'ios' ? 4 : 6,
      includeFontPadding: false,
      opacity: 0.8,
    },
  });

export default style;
