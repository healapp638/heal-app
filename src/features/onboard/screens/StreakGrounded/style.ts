import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import { hp } from '../../../../utils/dimension';

const style = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerWrapper: {
      paddingHorizontal: 20,
      marginBottom: -10,
      zIndex: 999,
    },
    mainContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
    },
    scrollView: {
      flex: 1,
      width: '100%',
    },
    scrollContentContainer: {
      flexGrow: 1,
      alignItems: 'center',
      paddingBottom: 16,
      width: '100%',
    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    flameContainer: {
      width: 140,
      height: 260,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(5),
      marginBottom: hp(2),
    },
    bigStreak: {
      width: 140,
      height: 260,
      position: 'absolute',
    },
    overlayText: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(72),
      color: colors.white,
      textAlign: 'center',
      position: 'absolute',
      top: 112,
      includeFontPadding: false,
    },
    title: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(22),
      color: colors.brown,
      textAlign: 'center',
      lineHeight: 30,
      marginBottom: 10,
      paddingHorizontal: 20,
      includeFontPadding: false,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      textAlign: 'center',
      marginBottom: 24,
      paddingHorizontal: 20,
      includeFontPadding: false,
    },
    streakCard: {
      backgroundColor: '#A073621A',
      borderRadius: 18,
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: '90%',
      marginTop: 8

    },
    daysRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',

      marginBottom: 16,
    },
    dayItem: {
      alignItems: 'center',
      flex: 1,
    },
    dayLabel: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(12),
      marginBottom: 8,
      textAlign: 'center',
      includeFontPadding: false,
      color:colors.brown
    },
    statusCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeCircle: {
      backgroundColor: colors.primary,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    inactiveCircle: {
      backgroundColor: '#F3F7FC',
      borderWidth: 1,
      borderColor: '#20202033',
    },
    tickIcon: {
      width: 29,
      height: 29,
    },
    cardCaption: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      textAlign: 'center',
      includeFontPadding: false,
    },
    btn: {
      alignSelf: 'center',
      marginBottom: Platform.OS === 'ios' ? 40 : 30,
    },
  });

export default style;
