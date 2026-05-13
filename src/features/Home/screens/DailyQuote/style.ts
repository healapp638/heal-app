import { StyleSheet, Platform, Dimensions } from 'react-native';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const style = (colors: any, insets: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      paddingHorizontal: 20,
      paddingTop: insets.top > 0 ? insets.top : 20,
    },
    slideContainer: {
      height: SCREEN_HEIGHT,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    quoteContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    captureContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quoteText: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.reco,
      color: '#3A2110',
      textAlign: 'center',
      lineHeight: 36,
      includeFontPadding: false,
      marginTop: Platform.OS == 'ios' ? -80 : -100, // Moved UP for better balance
    },
    quoteTextCentered: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.reco,
      color: '#3A2110',
      textAlign: 'center',
      lineHeight: 36,
      includeFontPadding: false,
    },
    footerContainer: {
      position: 'absolute',
      bottom: 180, // Consistent positioning relative to bottom safe area
      width: '100%',
      alignItems: 'center',
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBtn: {
      padding: 12,
      marginHorizontal: 15,
    },
    iconBtnLeft: {
      padding: 12,
      marginHorizontal: 15,
    },
    bottomIcon: {
      width: 28,
      height: 28,
      tintColor: '#3A2110',
    },
    themeBtn: {
      position: 'absolute',
      bottom: 40,
      right: 25,
    },
    themeBtn2: {
      position: 'absolute',
      bottom: 40,
      left: 25,
    },
    themeIcon: {
      width: 56,
      height: 56,
    },
    centerHeartContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -75, // Half of height
      marginLeft: -55, // Half of width
      zIndex: 100,
    },
    centerHeart: {
      width: 100,
      height: 100,
    },
    hiddenCaptureContainer: {
      position: 'absolute',
      left: -SCREEN_HEIGHT * 2, // Way off screen
      width: SCREEN_HEIGHT * (9 / 16), // Use a standard aspect ratio or SCREEN_WIDTH
      height: SCREEN_HEIGHT,
    },
  });

export default style;
