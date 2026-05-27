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
import { useDotAnimation } from './hooks/useDotAnimation';
import { useKeyboardHeight } from './hooks/useKeyboardHeight';
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
    setShouldScrollOnLayout,
    randomQuestions,
    loadMorePastMessages,
    isPaginationLoading,
  } = useHealyChat(flatListRef);

  const keyboardHeight = useKeyboardHeight(flatListRef);
  const [dot1, dot2, dot3] = useDotAnimation(isSending);

  const handleScroll = useCallback(
    (event: any) => {
      const { contentOffset } = event.nativeEvent;
      if (contentOffset.y <= 10) {
        loadMorePastMessages();
      }
    },
    [loadMorePastMessages],
  );

  const getDynamicWelcomeText = useCallback(() => {
    const basePrompt = localization.appkeys.chatWelcomePrompt || '';
    const morningKey = localization.appkeys.timeMorning || 'morning';

    const hour = new Date().getHours();
    let timeOfDay = localization.appkeys.timeMorning || 'morning';

    if (hour >= 5 && hour < 12) {
      timeOfDay = localization.appkeys.timeMorning || 'morning';
    } else if (hour >= 12 && hour < 17) {
      timeOfDay = localization.appkeys.timeAfternoon || 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      timeOfDay = localization.appkeys.timeEvening || 'evening';
    } else {
      timeOfDay = localization.appkeys.timeNight || 'night';
    }

    return basePrompt.replace(new RegExp(morningKey, 'gi'), timeOfDay);
  }, [localization.appkeys]);

  // Memoized render bubble item to prevent full re-renders of the list cells
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isUser = item.role === 'user';
      const isLatestAssistant =
        !isUser &&
        index === messages.length - 1 &&
        item._id !== lastStreamedId &&
        shouldAnimateNext;

      return (
        <MessageItem
          item={item}
          isLatestAssistant={isLatestAssistant}
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
              welcomeText={getDynamicWelcomeText()}
              styles={styles}
              questions={randomQuestions}
              onQuestionPress={handleSend}
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
                      dot1={dot1 as any}
                      dot2={dot2 as any}
                      dot3={dot3 as any}
                      styles={styles}
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
