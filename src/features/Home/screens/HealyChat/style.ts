import { StyleSheet, Platform } from 'react-native';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    welcomeContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 100, // Account for footer
    },
    logo: {
      width: 70,
      height: 70,
      marginBottom: 20,
    },
    welcomeText: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.recoMedium,
      color: colors.brown,
      textAlign: 'center',
      lineHeight: 28,
    },
    footerContainer: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 40 : 20,
      left: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    plusBtn: {},
    plusIcon: {
      width: 48,
      height: 48,
    },
    inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 30,
      height: 44,
      marginHorizontal: 12,
      paddingLeft: 20,
      paddingRight: 6,
      shadowColor: '#000000ff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    textInput: {
      flex: 1,
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.medium,
      color: colors.brown,
      paddingVertical: 0,
      includeFontPadding: false,
    },
    micIcon: {
      width: 22,
      height: 22,
      tintColor: colors.brown,
      marginRight: 8
    },
    listenBtn: {},
    listenIcon: {
      width: 32,
      height: 32,
      marginLeft: 4,
    },
    sidebarBtn: {
      padding: 10,
    },
    sidebarIcon: {
      width: 24,
      height: 24,
      tintColor: colors.brown,
    },
    // Message List Styles
    chatList: {
      flex: 1,
      width: '100%',
    },
    chatListContent: {
      paddingBottom: 110,
      paddingTop: 10,
      paddingHorizontal: 4,
    },
    messageContainer: {
      marginVertical: 6,
      flexDirection: 'row',
      width: '100%',
    },
    userMessageContainer: {
      justifyContent: 'flex-end',
    },
    aiMessageContainer: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      maxWidth: '82%',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 18,
    },
    userBubble: {
      backgroundColor: colors.brown + '18', // Warm sand tone dynamically blended from theme's brown color
      borderBottomRightRadius: 4, // Chat bubble corner shape
    },
    aiBubble: {
      backgroundColor: colors.primary + '18', // Warm light-rose tone dynamically blended from theme's primary color
      borderBottomLeftRadius: 4, // Chat bubble corner shape
    },
    messageText: {
      fontSize: AppUtils.fontSize(15),
      fontFamily: AppFonts.medium,
      color: colors.brown,
      lineHeight: 20,
    },
    timeText: {
      fontSize: AppUtils.fontSize(11),
      fontFamily: AppFonts.regular,
      color: 'rgba(58, 33, 16, 0.4)',
      marginTop: 4,
    },
    userTimeText: {
      textAlign: 'right',
    },
    aiTimeText: {
      textAlign: 'left',
    },
    typingBubble: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primary + '18', // Match bot bubble
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 18,
      borderBottomLeftRadius: 4,
      marginVertical: 6,
    },
    typingText: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.regular,
      color: 'rgba(58, 33, 16, 0.5)',
    },
  });

export default style;
