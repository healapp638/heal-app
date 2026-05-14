import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import { hp, wp } from '../../../../utils/dimension';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    homeHeaderSpacing: {
      marginTop: 10,
      marginBottom: 20,
    },
    title: {
      fontFamily: AppFonts.recoSemiBold,
      fontSize: AppUtils.fontSize(28),
      color: colors.brown,
      marginTop: 20,
      marginBottom: 4,
      includeFontPadding: false,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: 20,
      includeFontPadding: false,
    },
    // Profile Card
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgb(235,213,195)',
      borderRadius: 22,
      padding: Platform.OS == 'ios' ? 10 : 8,
      marginBottom: Platform.OS == 'ios' ? 20 : 18,
    },
    avatar: {
      width: 62,
      height: 62,
      borderRadius: 32,
      marginRight: 16,
    },
    profileInfo: {
      flex: 1,
    },
    userName: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: Platform.OS == 'ios' ? 6 : 2,
    },
    userEmail: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
    },
    logoutBtn: {},
    logoutIcon: {
      width: 65,
      height: Platform.OS == 'ios' ? 30 : 28,
    },
    // Setting Item
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      borderRadius: 16,
      minHeight: 62,
      paddingHorizontal: 12,
      marginBottom: 12,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    settingItemText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      includeFontPadding: false,
    },
    arrowIcon: {
      width: 14,
      height: 14,
      tintColor: colors.brown,
    },
    toggleIcon: {
      width: 40,
      height: 24,
    },
    // Emergency Resources
    emergencyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FDE2E4',
      borderRadius: 16,
      minHeight: 62,
      paddingVertical: Platform.OS == 'ios' ? 8 : 6,

      paddingHorizontal: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#F9D1D5',
    },
    phoneIconContainer: {},
    phoneIcon: {
      width: 41,
      height: 41,
      marginRight: 10,
      marginLeft: -4,
    },
    emergencyText: {
      flex: 1,
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      includeFontPadding: false,
    },
    // Premium Card
    premiumCard: {
      backgroundColor: '#EBD5C3',
      borderRadius: 24,
      padding: 18,
      alignItems: 'center',
      overflow: 'hidden',
    },
    premiumText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      lineHeight: 22,
      textAlign: 'center',

      marginBottom: 20,
    },
    premiumBold: {
      fontStyle: 'italic',
      color: colors.brown,
      fontWeight: Platform.OS === 'ios' ? '700' : '900',
      fontSize: AppUtils.fontSize(14),
    },
    logoContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: -10,
      bottom: 20,
    },
    logoImage: {
      width: 40,
      height: 40,
    },
    discoverBtn: {
      width: '100%',
      backgroundColor: '#3A2110',
      borderRadius: 99,
      paddingVertical: 14,
      alignItems: 'center',
    },
    discoverText: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: 'white',
    },
    // Footer
    footer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: Platform.OS === 'ios' ? 120 : 100,
    },
    footerText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      marginTop: 20,
    },
    footerLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(2),
      alignSelf: 'center',
    },
    footerLink: {
      fontFamily: AppFonts.regular,
      fontSize: wp(3),
      color: '#666',
      includeFontPadding: false,
    },
    footerDot: {
      marginHorizontal: 8,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#999',
    },
  });

export default style;
