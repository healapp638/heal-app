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
      tintColor: '#999',
    },
    title: {
      fontSize: AppUtils.fontSize(25),
      textAlign: 'center',
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      includeFontPadding: false

    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.black,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: hp(2),
    },
    timelineCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      flexDirection: 'row',
      paddingVertical:8,
      paddingHorizontal:4,
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
    },
    premiumImage: {
      width: 35,
      height: 200,
    },
    timelineRight: {
      flex: 1,
      paddingLeft: 15,
      justifyContent: 'space-between',

    },
    timelineItem: {
      flex: 1,
      justifyContent: 'center',

    },
    timelineTitle: {
      fontFamily: AppFonts.recoMedium,
      fontSize: AppUtils.fontSize(16),
      color: colors.black,
      includeFontPadding: false
    },
    timelineSub: {
      fontFamily: AppFonts.regular,
      fontSize: 12,
      color: '#666',
      includeFontPadding: false,paddingRight:20,
      marginTop:2,
lineHeight:20,


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
      fontFamily: AppFonts.regular,
      fontSize: 14,
      color: colors.black,
      includeFontPadding: false

    },
    toggleIcon: {
      width: 44,
      height: 24,
    },
    plansContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      width:'100%'
    },
    planCard: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 10,
      borderWidth: 1.5,
      borderColor: 'transparent',
      width: '48%',
      height: 80,
      justifyContent: 'center',
    },
    activePlanCard: {
      borderColor: colors.brown,
    },
    planLabel: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(18),
      color: colors.black,
      marginBottom: 5,
      includeFontPadding: false

    },
    planPrice: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.black,
      marginTop:4,
      includeFontPadding: false
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
      includeFontPadding: false

    },
    priceInfo: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#666',
      textAlign: 'center',
      marginBottom: hp(2),
      includeFontPadding: false

    },
    actionBtn: {
      width: '90%',

      marginBottom: 25,
      marginTop:45
    },
    actionBtnText: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(18),
      color: colors.white,
      includeFontPadding: false

    },
    promoBtn: {
      alignSelf: 'center',
      marginBottom: hp(4),
    },
    promoText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.black,
      textDecorationLine: 'underline',
      includeFontPadding: false

    },
    footerLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp(4),
    },
    footerLink: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#666',
      includeFontPadding: false

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
