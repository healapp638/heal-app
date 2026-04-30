import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import { wp } from '../../../../utils/dimension';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },

    doorImage: {
      width: 180,
      height: 180,
      marginTop: 40,
      alignSelf: 'center',
      marginBottom: 20,
    },
    title: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(26),
      color: colors.brown,
      textAlign: 'center',
      marginBottom: 30,
    },
    privacyCard: {
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      height: 70,
      paddingHorizontal: 10,
      marginBottom: 12,
    },

    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 100,
      marginRight: 10,
    },
    cardText: {
      flex: 1,
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      lineHeight: 20,
    },
    checkboxContainer: {
      flexDirection: 'row',

      marginTop: 6,
      paddingHorizontal: 5,
    },
    checkboxImage: {
      width: 24,
      height: 24,
      marginRight: 12,
    },
    checkboxText: {
      flex: 1,
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      lineHeight: 20,
    },
    btn: {
      marginTop: 30,
      marginBottom: 20,
      alignSelf: 'center',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    footerText: {
      fontFamily: AppFonts.regular,
      fontSize: wp(3),
      color: colors.brown,
      opacity: 0.8,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.brown,
      marginHorizontal: 8,
      opacity: 0.8,
    },
  });

export default style;
