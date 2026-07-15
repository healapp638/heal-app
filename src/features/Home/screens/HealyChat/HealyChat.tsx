import React, {
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  FlatList,
  ActivityIndicator,
  Platform,
  Keyboard,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

// Custom Hooks
import { useHealyChat } from './hooks/useHealyChat';

// Extracted Components
import { WelcomeView } from './components/WelcomeView';
import { MessageItem } from './components/MessageItem';
import { ThinkingBubble } from './components/ThinkingBubble';
import { ChatInputBar } from './components/ChatInputBar';
import { ConversationDrawer } from './components/ConversationDrawer';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import { triggerHaptic } from '../../../../hooks/useHaptic';

const HealyChat = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const flatListRef = useRef<FlatList>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const user = useSelector((state: any) => state.userData?.user);
  const [creditsModalVisible, setCreditsModalVisible] = useState(false);
  const hasAutoShown = useRef(false);

  useEffect(() => {
    // const credits = user?.credits ?? user?.ai_credits;
    // if (credits === 0 && !hasAutoShown.current) {
    // setCreditsModalVisible(true);
    //   hasAutoShown.current = true;
    // }
  }, [user]);

  // Custom Hooks for business logic, keyboard layout, and bouncing loading dots
  const {
    messages,
    isSending,
    lastStreamedId,
    setLastStreamedId,
    shouldAnimateNext,
    setShouldAnimateNext,
    isHistoryLoading,
    handleSend,
    retryPendingMessage,
    conversationId,
    setConversationId,
    startNewChat,
    shouldScrollOnLayout,
    randomQuestion,
    isRandomQuestionsFetching,
    loadMorePastMessages,
    isPaginationLoading,
    extraPadding,
    handleScroll,
    handleContentSizeChange,
    handleLayout,
  } = useHealyChat(flatListRef, setCreditsModalVisible);

  // Removed getDynamicWelcomeText to display the random question directly as welcome text

  const lastAiMessageIndex = messages
    .map(m => m.role !== 'user')
    .lastIndexOf(true);

  // Memoized render bubble item to prevent full re-renders of the list cells
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isUser = item.role === 'user';
      const isLatestAssistant =
        !isUser &&
        index === messages.length - 1 &&
        item._id !== lastStreamedId &&
        shouldAnimateNext;

      const showDisclaimer =
        !isUser &&
        index === lastAiMessageIndex &&
        !isSending &&
        !shouldAnimateNext;

      return (
        <MessageItem
          item={item}
          isLatestAssistant={isLatestAssistant}
          showDisclaimer={showDisclaimer}
          styles={styles}
          logoSource={images.h}
          tintColor={colors.primary}
          onComplete={() => {
            setLastStreamedId(item._id);
            setShouldAnimateNext(false);
          }}
          onStreamStart={() => {
            triggerHaptic('impactMedium');
          }}
        />
      );
    },
    [
      messages.length,
      lastStreamedId,
      shouldAnimateNext,
      isSending,
      styles,
      images.h,
      colors.primary,
      setLastStreamedId,
      setShouldAnimateNext,
      lastAiMessageIndex,
    ],
  );

  // Stable key extractor to optimize VirtualizedList performance
  const keyExtractor = useCallback((item: any) => {
    return item._id || item.id || `msg-${Math.random()}`;
  }, []);

  return (
    <SolidView
      isScrollEnabled={false}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -20 : 0}
      behavior="padding"
      view={
        <View style={styles.mainContainer}>
          {/* Custom Header with Sidebar */}
          <HeaderCommon
            title={localization.appkeys.healyChat}
            rightIcon={images.sideBar}
            onRightPress={() => {
              Keyboard.dismiss();
              setIsDrawerOpen(true);
            }}
            rightIconStyle={{
              height: 18,
              width: 18,
            }}
            viewStyle={{ marginBottom: 0 }}
          />

          {/* History loading indicator when screen is loaded */}
          {isHistoryLoading && messages.length === 0 ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ flex: 1, justifyContent: 'center' }}
            />
          ) : null}

          {/* Welcome Screen or Message List */}
          {messages.length === 0 && !isHistoryLoading ? (
            <WelcomeView
              logoSource={images.h}
              logoColor={colors.primary}
              welcomeText={randomQuestion}
              styles={styles}
              isLoadingQuestion={isRandomQuestionsFetching}
            />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              style={styles.chatList}
              contentContainerStyle={[
                styles.chatListContent,
                {
                  paddingBottom:
                    styles.chatListContent.paddingBottom + extraPadding,
                },
              ]}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 0,
              }}
              onContentSizeChange={handleContentSizeChange}
              onLayout={handleLayout}
              onScrollToIndexFailed={info => {
                flatListRef.current?.scrollToOffset({
                  offset: info.averageItemLength * info.index,
                  animated: false,
                });
                setTimeout(() => {
                  try {
                    flatListRef.current?.scrollToIndex({
                      index: info.index,
                      viewPosition: 0,
                      viewOffset: -20,
                      animated: true,
                    });
                  } catch (err) {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }
                }, 200);
              }}
              showsVerticalScrollIndicator={false}
              // List memory and rendering optimizations
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={Platform.OS === 'android'}
              ListHeaderComponent={() => {
                if (isPaginationLoading) {
                  return (
                    <ActivityIndicator
                      size="small"
                      color={colors.primary}
                      style={{ marginVertical: 10 }}
                    />
                  );
                }
                return null;
              }}
              ListFooterComponent={() => {
                if (isSending) {
                  return (
                    <ThinkingBubble
                      logoSource={images.h}
                      styles={styles}
                      tintColor={colors.primary}
                    />
                  );
                }
                return null;
              }}
            />
          )}

          {/* Chat Input Bar */}
          <ChatInputBar
            onSend={handleSend}
            placeholder={localization.appkeys.chatInputPlaceholder}
            plusIconSource={images.plus}
            sendIconSource={images.send}
            micIconSource={images.microPhone}
            styles={styles}
            isDisabled={isSending || shouldAnimateNext}
          />

          {/* Paginated Conversations History Drawer */}
          <ConversationDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            activeConversationId={conversationId}
            onSelectConversation={setConversationId}
            onNewChat={startNewChat}
            styles={styles}
          />
          <GetCreditsModal
            visible={creditsModalVisible}
            onClose={() => setCreditsModalVisible(false)}
            onPurchaseSuccess={retryPendingMessage}
          />
        </View>
      }
    />
  );
};

export default HealyChat;
