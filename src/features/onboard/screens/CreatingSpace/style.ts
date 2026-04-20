import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      fontFamily: AppFonts.reco,
      fontSize: AppUtils.fontSize(28),
      color: colors.black,
      textAlign: 'center',
      marginBottom: hp('1%'),
      paddingHorizontal: wp('10%'),
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.black,

      textAlign: 'center',
      marginBottom: hp('4%'),

    },
    gif: {
      width: wp('100%'),
      height: hp('26%'),
      alignSelf: 'center',
      marginBottom: hp('4%'),
    },
    textContainer: {
      paddingHorizontal: wp('6%'),
      gap: hp('2%'),
    },
    sentenceRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    sentence: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      lineHeight: 24,
      color: colors.black,
      textAlign: 'center',

    },
    cursor: {
      color: '#DF9D83',
      fontSize: 18,
    },
    btnContainer: {
      marginBottom: hp('5%'),
      paddingHorizontal: 20,
    },
  });

export default style;
