import { StyleSheet, Platform, Dimensions } from 'react-native';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const H_PADDING = 20;
const CARD_GAP = 10;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - CARD_GAP * 2) / 3;

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      paddingHorizontal: H_PADDING,
      paddingBottom: 40,
      flex: 1,
    },
    title: {
      fontFamily: AppFonts.recoMedium,
      fontSize: AppUtils.fontSize(24),
      color: colors.brown,
      marginBottom: 4,
      includeFontPadding: false,
      marginTop: -10,
    },
    dateText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      marginBottom: 22,
      includeFontPadding: false,
    },
    sectionTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      marginBottom: 14,
      includeFontPadding: false,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
      rowGap: CARD_GAP,
      columnGap: CARD_GAP,
      marginTop: Platform.OS == 'ios' ? -0 : -2,
    },
    emotionCard: {
      width: CARD_WIDTH - 2,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      alignItems: 'center',
      position: 'relative',
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.07,
      shadowRadius: 4,
      // Android shadow
      elevation: 2,
    },
    emotionCardSelected: {
      // No style changes needed - overlay image handles visual
    },
    emotionImage: {
      width: CARD_WIDTH - 10,
      height: CARD_WIDTH - 10,
      overflow: 'hidden',
      borderRadius: 8,
      marginTop: 5,
    },
    selectedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '101%',
      height: '101%',

      zIndex: 9999,
      overflow: 'hidden',
    },
    emotionText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(13),
      color: colors.brown,
      includeFontPadding: false,
      textAlign: 'center',
      paddingVertical: 8,
    },
    titleInput: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      height: Platform.OS === 'ios' ? 52 : 48,
      paddingHorizontal: 10,
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
      includeFontPadding: false,
    },

    bodyContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      minHeight: 160,
      paddingHorizontal: 10,

      paddingTop: 10,
      paddingBottom: 48,
      marginBottom: 24,
      position: 'relative',
      borderWidth: 1,
      borderColor: colors.border,
      includeFontPadding: false,
    },
    bodyInput: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      textAlignVertical: 'top',
      minHeight: 100,
      padding: 0,
    },
    micIconContainer: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    micButtonActive: {
      backgroundColor: colors.brown,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    micIcon: {
      width: 18,
      height: 18,
      tintColor: colors.brown,
    },
    listeningText: {
      position: 'absolute',
      bottom: 16,
      left: 10,
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.medium,
      color: colors.brown,
      includeFontPadding: false,
    },
    saveButton: {
      width: '90%',
    },
  });

export default style;
