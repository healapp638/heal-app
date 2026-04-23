import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    headerTextContainer: {
      marginBottom: 30,
      marginTop: -14,
    },
    title: {
      fontFamily: AppFonts.recoMedium,
      fontSize: AppUtils.fontSize(24),
      color: colors.brown,
      includeFontPadding: false,
      marginBottom: 2,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      opacity: 0.8,
    },
    taskCard: {
      backgroundColor: colors.blocks, // Light pink/peach color matching the screenshot
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingBottom: 10,
      alignItems: 'center',
      marginTop: 20, // Space for the top badge
    },
    badgeWrapper: {
      position: 'absolute',
      top: -30, // Half of badge height to overlap
      alignSelf: 'center',
    },
    badgeCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'white',
      borderWidth: 6,
      borderColor: colors.background, // Creates the cutout effect
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeIcon: {
      width: 24,
      height: 24,
    },
    taskText: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(18),
      color: colors.black,
      textAlign: 'center',
      lineHeight: 24,
      marginTop: 40, // Push content down below the badge
      marginBottom: Platform.OS == 'ios' ? 10 : 8,
    },
    pointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#604033', // Deep brown background for the badge
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    pointsIcon: {
      width: 14,
      height: 14,
      marginRight: 4,
    },
    pointsText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: 'white',
      includeFontPadding: false,
    },
    aboutCard: {
      backgroundColor: colors.cardBeige,
      borderRadius: 16,
      padding: 12,
      marginTop: 20,
      marginBottom: 20,
    },
    aboutTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: 8,
    },
    aboutText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      opacity: 0.85,
      lineHeight: 22,
    },
  });

export default style;
