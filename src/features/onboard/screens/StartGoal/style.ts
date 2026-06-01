import { StyleSheet } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    heartRope: {
      width: 400,
      height: 77,
      alignSelf: 'center',
      marginBottom: 10,
      marginTop: -10,
    },
    title: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(22),
      color: colors.brown,
      marginTop: -10,
      marginBottom: 8,
      includeFontPadding: false,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      marginBottom: 20,
    },
    listContainer: {
      flexDirection: 'column',
    },
    optionCard: {
      width: '100%',
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginBottom: 10,
      borderRadius: 16,
      backgroundColor: colors.white,
      borderWidth: 1.5,
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 5,
      elevation: 1,
    },
    optionCardSelected: {
      borderColor: colors.brown,
    },
    optionText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(15),
      color: colors.brown,
      textAlign: 'center',
      includeFontPadding: false,
    },
    optionTextSelected: {},
    btn: {
      alignSelf: 'center',
      marginBottom: 40,
    },
    btnContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default style;
