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
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 120, // Keep a fixed top offset so it doesn't shift when keyboard opens
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
    questionsContainer: {
      marginTop: 24,
      width: '100%',
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    questionChip: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'rgba(58, 33, 16, 0.08)',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 16,
      marginVertical: 6,
      width: '100%',
      shadowColor: '#000000ff',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    questionText: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.medium || 'Outfit-Medium',
      color: colors.brown,
      textAlign: 'center',
    },
    footerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: Platform.OS === 'ios' ? 28 : 16,
      paddingTop: 8,
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
      minHeight: 44,
      maxHeight: 240,
      marginHorizontal: 12,
      paddingLeft: 20,
      paddingRight: 6,
      paddingVertical: Platform.OS === 'ios' ? 8 : 4,
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
      paddingTop: 0,
      paddingBottom: 0,
      includeFontPadding: false,
      maxHeight: 220,
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
      paddingBottom: 10,
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
      backgroundColor: colors.primary + '33', // Soft rose pink matching the third screenshot
    },
    aiBubble: {
      backgroundColor: colors.primary + '18', // Warm light-rose tone dynamically blended from theme's primary color
      borderBottomLeftRadius: 4, // Chat bubble corner shape
    },
    messageText: {
      fontSize: AppUtils.fontSize(15.5),
      fontFamily: AppFonts.regular,
      color: colors.brown,
      lineHeight: 25, // Increased line height for legibility as per screenshot
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
      marginBottom:40
    },
    typingText: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.regular,
      color: 'rgba(58, 33, 16, 0.5)',
    },
    // Claude-Style Brand Animation Styles
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      height: 24,
    },
    thinkingBubbleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 18,
      borderBottomLeftRadius: 4,
      marginVertical: 6,
      backgroundColor: colors.primary + '18',
    },
    thinkingLogoImage: {
      width: 18,
      height: 18,
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 6,
    },
    thinkingDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
      marginHorizontal: 2,
    },
    inlineLogo: {
      width: 16,
      height: 16,
    },
    // Drawer Modal Styles
    drawerOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    drawerBackdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    drawerContainer: {
      width: '78%',
      height: '100%',
      backgroundColor: colors.background || '#F9F6F0',
      borderTopLeftRadius: 24,
      borderBottomLeftRadius: 24,
      paddingTop: 20,
      paddingHorizontal: 20,
      shadowColor: '#00',
      shadowOffset: { width: -4, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 16,
    },
    drawerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    drawerTitle: {
      fontSize: AppUtils.fontSize(20),
      fontFamily: AppFonts.recoMedium || 'Recoleta-Medium',
      color: colors.brown,
    },
    closeBtn: {
      padding: 6,
    },
    closeIcon: {
      width: 24,
      height: 24,
      tintColor: colors.brown,
    },
    newChatBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 25,
      paddingVertical: 12,
      marginBottom: 20,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 4,
    },
    newChatIcon: {
      width: 18,
      height: 18,
      tintColor:  'white',
      marginRight: 8,
    },
    newChatBtnText: {
      fontSize: AppUtils.fontSize(15),
      fontFamily: AppFonts.bold || 'Outfit-Bold',
      color: 'white',
    },
    drawerList: {
      flex: 1,
    },
    drawerListItem: {
      padding: 16,
      borderRadius: 14,
      backgroundColor: 'white',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: 'rgba(58, 33, 16, 0.05)',
    },
    drawerListItemActive: {
      backgroundColor: colors.primary + '12',
      borderColor: colors.primary,
    },
    drawerListItemText: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.medium || 'Outfit-Medium',
      color: colors.brown,
      marginBottom: 4,
    },
    drawerListItemDate: {
      fontSize: AppUtils.fontSize(11),
      fontFamily: AppFonts.regular || 'Outfit-Regular',
      color: 'rgba(58, 33, 16, 0.4)',
    },
    drawerEmptyText: {
      fontSize: AppUtils.fontSize(14),
      fontFamily: AppFonts.regular || 'Outfit-Regular',
      color: 'rgba(58, 33, 16, 0.5)',
      textAlign: 'center',
      marginTop: 40,
    },
    drawerLoader: {
      marginVertical: 15,
    },
  });

export default style;
