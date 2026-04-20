import { StyleSheet, Platform } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    heartRope: {
       width: 400, // Slightly larger to bleed over edges as in screenshot
       height: 77,
       alignSelf: 'center',
       marginBottom: 10,
       marginTop:-10

    },
    title: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(22),
      color: colors.black,
      marginTop: -10,
      marginBottom: 8,
      includeFontPadding: false,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.black,
      marginBottom: 20,
    },
    listContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',


    },
    optionCard: {
      width: '48.5%',
      height: 90,
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 10,

      marginBottom: 10,
      borderRadius: 16,
      backgroundColor: colors.white,
      borderWidth: 1.5,
      borderColor: 'transparent',
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 5,
      // Android shadow
      elevation: 1,
    },
    optionCardSelected: {
      borderColor: colors.brown, 
    },
    iconWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    icon: {
      width: 30,
      height: 30,
    },
    optionText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      color: colors.black,
    },
    optionTextSelected: {
      // maybe no text change needed, border handles it
    },
    optionCardFull: {
      width: '100%',
      height: 70, 
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    optionCardFullLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionCardFullIcon: {
      marginRight: 15,
    },
    btn: {
alignSelf:'center',
marginBottom:10
    },
    tickIcon: {
      width: 24,
      height: 24,
    }
  });

export default style;
