import { StyleSheet, Platform, Dimensions } from 'react-native';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const style = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerWrapper: {
      position: 'absolute',

      left: 0,
      right: 0,
      zIndex: 10,
      paddingHorizontal: 20,
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
      marginTop: Platform.OS == 'ios' ? -80 : -10,
    },
    footerContainer: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 160 : 100,
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
      bottom: Platform.OS === 'ios' ? 40 : 30,
      right: 25,
    },
    themeBtn2: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 40 : 30,

      left: 25,
    },
    themeIcon: {
      width: Platform.OS == 'ios' ? 56 : 50,
      height: Platform.OS == 'ios' ? 56 : 50,
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
  });

export default style;
