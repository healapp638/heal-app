import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontFamily: AppFonts.recoSemiBold,
      fontSize: AppUtils.fontSize(22),
      color: colors.brown,
      marginBottom: 6,
      includeFontPadding: false,
      marginTop: Platform.OS === 'ios' ? -20 : -10,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      marginBottom: 24,
      includeFontPadding: false,
    },
    progressCardMargin: {
      marginBottom: Platform.OS == 'ios' ? 20 : 18,
      width: '100%',
      marginTop: Platform.OS == 'ios' ? -6 : -8,
    },
    sectionTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: Platform.OS == 'ios' ? 16 : 14,
      marginTop: 6,
      includeFontPadding: false,
    },
    itemCard: {
      backgroundColor: 'white',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 5,
      // Android shadow
      elevation: 2,
    },
    itemCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 4.5,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    circleText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(13),
      includeFontPadding: false,
    },
    itemLabel: {
      flex: 1,
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      includeFontPadding: false,
      lineHeight: 20,
    },
    forwardIcon: {
      width: 14,
      height: 14,
      marginLeft: 10,
    },
  });

export default style;
