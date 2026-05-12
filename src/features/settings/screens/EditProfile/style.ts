import { StyleSheet, Platform } from 'react-native';
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
      paddingHorizontal: 20,
    },
    headerSpacing: {
      marginBottom: 10,
    },
    title: {
      fontFamily: AppFonts.recoSemiBold,
      fontSize: AppUtils.fontSize(28),
      color: colors.brown,
      marginTop: 10,
      marginBottom: 4,
      includeFontPadding: false,
    },
    subtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: 30,
      includeFontPadding: false,
    },
    // Profile Picture Section
    profilePicContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    imageWrapper: {
      width: 80,
      height: 80,
      borderRadius: 50,
      position: 'relative',
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
    },
    editIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.lightBrown,
      width: 26,
      height: 26,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.background,
    },
    editIcon: {
      width: 14,
      height: 14,
      tintColor: colors.white,
    },
    changePictureText: {
      marginTop: 12,
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(14),
      color: colors.primary,
      includeFontPadding: false,
    },
    // Form
    formContainer: {
      width: '100%',
    },
    saveBtn: {
      backgroundColor: colors.brown,
      width: '90%',
      borderRadius: 100,
      marginTop: hp('4%'),
      marginBottom: hp('4%'),
    },
    changePassCard: {
      backgroundColor: 'rgba(234,172,144,0.17)', // cardBeige
      borderRadius: 22,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      marginTop: 10,
      paddingVertical: Platform.OS == 'ios' ? 13 : 12,
    },
    changePassLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    changePassTitle: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.medium,
      color: colors.brown,
      includeFontPadding: false,
    },
    arrowIcon: {
      width: 16,
      height: 16,
      tintColor: colors.brown,
    },
  });

export default style;
