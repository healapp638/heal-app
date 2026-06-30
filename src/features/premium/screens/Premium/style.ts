import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import { hp, wp } from '../../../../utils/dimension';

const style = (colors: any, appLanguage: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    closeBtn: {
      marginTop: Platform.OS === 'ios' ? hp(2) : hp(3),
      marginBottom: hp(2),
      height: 14, // Same as closeIcon height
    },
    closeBtnPlaceholder: {
      marginTop: Platform.OS === 'ios' ? hp(2) : hp(3),
      marginBottom: hp(2),
      height: 14,
    },
    closeIcon: {
      width: 14,
      height: 14,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    headerLeft: {
      width: 40,
      alignItems: 'flex-start',
    },
    headerRight: {
      width: 40,
    },
    headerTitleContainer: {
      flex: 1,
    },
    headerTitle: {
      marginBottom: 0,
      textAlign: 'center',
    },
    title: {
      fontSize: AppUtils.fontSize(25),
      textAlign: 'center',
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      includeFontPadding: false,


    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: hp(2),
    },
    timelineCard: {
      backgroundColor: colors.white,
      borderRadius: 24,
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 5,
      marginBottom: hp(3),
      // Shadow for iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      // Elevation for Android
      elevation: 2,
    },
    timelineLeft: {
      width: wp(12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    premiumImage: {
      width: wp(11),
      height: Platform.OS == 'ios' ? hp(32) : hp(34),
      resizeMode: 'stretch',
    },
    premiumImage2: {
      width: wp(11),
      height: Platform.OS == 'ios' ? hp(29) : hp(30),
      resizeMode: 'stretch',
    },
    timelineRight: {
      flex: 1,
      paddingLeft: 6,
    },
    timelineItem: {
      justifyContent: 'center',
    },
    timelineItemCenter: {
      justifyContent: 'center',
      marginVertical: Platform.OS == 'ios' ? hp(3.5) : hp(3),
    },
    timelineTitle: {
      fontFamily: AppFonts.recoMedium,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      includeFontPadding: false,
    },
    timelineSub: {
      fontFamily: AppFonts.regular,
      fontSize: 12,
      color: '#666',
      includeFontPadding: false,
      paddingRight: 30,
      marginTop: 2,
      lineHeight: 20,
    },
    reminderRow: {
      backgroundColor: colors.white,
      borderRadius: 100,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: hp(4),
    },
    reminderText: {
      flex: 1,
      marginRight: 10,
      fontFamily: AppFonts.regular,
      fontSize: 14,
      color: colors.brown,
      includeFontPadding: false,
    },
    toggleIcon: {
      width: 44,
      height: 24,
    },
    plansContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      width: '100%',
    },
    planCard: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1.5,
      borderColor: 'transparent',
      width: '48%',
      height: 115,
      justifyContent: 'center',
    },
    activePlanCard: {
      borderColor: colors.brown,
    },
    planLabel: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: 2,
      includeFontPadding: false,
    },
    planPriceAmount: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(26),
      color:colors.brown,
      marginTop: 2,
      includeFontPadding: false,
    },
    planPricePeriod: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#666',
      marginTop: 2,
      includeFontPadding: false,
    },
    badge: {
      position: 'absolute',
      top: -12,
      right: 10,
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    badgeText: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(11),
      color: colors.white,
      includeFontPadding: false,
    },
    priceInfo: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#666',
      textAlign: 'center',
      marginBottom: hp(2),
      includeFontPadding: false,
    },
    actionBtn: {
      width: '90%',

      marginBottom: 25,

    },
    actionBtnText: {
      fontFamily: AppFonts.semiBold,

      color: colors.white,
      includeFontPadding: false,
    },
    promoBtn: {
      alignSelf: 'center',
      marginBottom: hp(4),
    },
    promoText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      textDecorationLine: 'underline',
      includeFontPadding: false,
    },
    footerLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: hp(4),
      width: '100%',
      alignSelf: 'center',
    },
    footerLink: {
      fontFamily: AppFonts.regular,
      fontSize: wp(2.8),
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
