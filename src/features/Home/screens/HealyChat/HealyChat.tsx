import React, { useContext, useRef, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Platform,
  Keyboard,
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

const HealyChat = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const flatListRef = useRef<FlatList>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    conversationId,
    setConversationId,
    startNewChat,
    shouldScrollOnLayout,
    randomQuestion,
    loadMorePastMessages,
    isPaginationLoading,
    firstAssistantMessageId,
  } = useHealyChat(flatListRef);

  const handleScroll = useCallback(
    (event: any) => {
      const { contentOffset } = event.nativeEvent;
      if (contentOffset.y <= 10) {
        loadMorePastMessages();
      }
    },
    [loadMorePastMessages],
  );

  // Removed getDynamicWelcomeText to display the random question directly as welcome text

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
        (item._id === firstAssistantMessageId ||
          item.id === firstAssistantMessageId);

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
        />
      );
    },
    [
      messages.length,
      lastStreamedId,
      shouldAnimateNext,
      styles,
      images.h,
      colors.primary,
      setLastStreamedId,
      setShouldAnimateNext,
      firstAssistantMessageId,
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
                  paddingBottom: styles.chatListContent.paddingBottom,
                },
              ]}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 0,
              }}
              onContentSizeChange={() => {
                if (isSending || shouldAnimateNext || shouldScrollOnLayout) {
                  flatListRef.current?.scrollToEnd({ animated: false });
                }
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
        </View>
      }
    />
  );
};

export default HealyChat;
