import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  FlatList,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { useSelector } from 'react-redux';
import useGetApi from '../../../../hooks/useGetApi';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import StreamingMessageText from './components/StreamingMessageText';

const HealyChat = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);

  const [chatText, setChatText] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [lastStreamedId, setLastStreamedId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const token = useSelector((state: any) => state.userData?.token);

  // Animated values for the three loading dots
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // Dot bouncing animation sequence loops (calm, fluid, staggered)
  useEffect(() => {
    let animation1: Animated.CompositeAnimation | null = null;
    let animation2: Animated.CompositeAnimation | null = null;
    let animation3: Animated.CompositeAnimation | null = null;

    if (isSending) {
      const animateDot = (value: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(value, {
              toValue: -4,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.delay(600 - delay),
          ])
        );
      };

      animation1 = animateDot(dot1, 0);
      animation2 = animateDot(dot2, 150);
      animation3 = animateDot(dot3, 300);

      animation1.start();
      animation2.start();
      animation3.start();
    } else {
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    }
    return () => {
      if (animation1) {
        animation1.stop();
      }
      if (animation2) {
        animation2.stop();
      }
      if (animation3) {
        animation3.stop();
      }
    };
  }, [isSending, dot1, dot2, dot3]);

  // Fetch Message History
  const {
    data: chatData,
    refetch,
    isLoading: isHistoryLoading,
  } = useGetApi(endpoints.getMessageList, ['getMessageList', conversationId], {
    conversation_id: conversationId,
  });

  // Send Message Mutation
  const { mutate: sendMessageMutate } = usePostApi();

  // Load messages from query response
  useEffect(() => {
    if (chatData?.data?.result) {
      setMessages(chatData.data.result);
    } else if (chatData?.result) {
      setMessages(chatData.result);
    }
  }, [chatData]);

  // Synchronize conversation_id if found in history list
  useEffect(() => {
    const apiConvId =
      chatData?.data?.conversation_id || chatData?.conversation_id;
    if (apiConvId && apiConvId !== conversationId) {
      setConversationId(apiConvId);
    }
  }, [chatData, conversationId]);

  // Auto-scroll to the bottom when new messages arrive or when sending
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [messages, isSending]);

  // Handle message submission
  const handleSend = () => {
    if (chatText.trim().length === 0) return;

    Keyboard.dismiss();
    triggerHaptic('impactMedium');

    const userMessageContent = chatText.trim();
    setChatText('');

    // Optimistically add user's message to FlatList for real-time responsiveness
    const tempUserMsg = {
      _id: `temp-user-${Date.now()}`,
      role: 'user',
      message: userMessageContent,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    sendMessageMutate(
      {
        endpoint: endpoints.sendMessage,
        data: {
          role: 'user',
          conversation_id: conversationId, // First message sends empty string
          message: userMessageContent,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log('sendMessage response:', res);
          // Set conversation id once received from response
          const newConvId =
            res?.data?.conversation_id ||
            res?.conversation_id ||
            res?.data?.id ||
            res?.id;
          if (newConvId && !conversationId) {
            setConversationId(newConvId);
          }

          // Refetch messages to update thread with bot response
          refetch().finally(() => {
            setIsSending(false);
          });
        },
        onError: (err: any) => {
          console.log('sendMessage error:', err);
          setIsSending(false);
        },
      }
    );
  };

  // Time formatter matching design layout (11:54 AM, 2:20 PM)
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      return `${hours}:${minutesStr} ${ampm}`;
    } catch {
      return '';
    }
  };

  const formatMessageTime = (item: any) => {
    if (item.time) return item.time;
    const formatted = formatTime(item.createdAt);
    if (formatted) return formatted;

    // Default to current time for optimistic messages
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // Render individual chat bubbles
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isUser = item.role === 'user';
    const isLatestAssistant =
      !isUser && index === messages.length - 1 && item._id !== lastStreamedId;

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          {isUser ? (
            <SolidText style={styles.messageText}>{item.message}</SolidText>
          ) : (
            <StreamingMessageText
              text={item.message}
              isLatest={isLatestAssistant}
              style={styles.messageText}
              logoSource={images.h}
              logoStyle={styles.inlineLogo}
              tintColor={colors.primary}
              onComplete={() => setLastStreamedId(item._id)}
            />
          )}
          <SolidText
            style={[
              styles.timeText,
              isUser ? styles.userTimeText : styles.aiTimeText,
            ]}
          >
            {formatMessageTime(item)}
          </SolidText>
        </View>
      </View>
    );
  };

  return (
    <SolidView
      isScrollEnabled={false}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      view={
        <View style={styles.mainContainer}>
          {/* Custom Header with Sidebar */}
          <HeaderCommon
            title={localization.appkeys.healyChat}
            rightIcon={images.sideBar}
            onRightPress={() => {}}
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
            <View style={styles.welcomeContainer}>
              <Image
                source={images.h}
                style={styles.logo}
                resizeMode="contain"
                tintColor={colors.primary}
              />
              <SolidText style={styles.welcomeText}>
                {localization.appkeys.chatWelcomePrompt}
              </SolidText>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item) =>
                item._id || item.id || `msg-${Math.random()}`
              }
              style={styles.chatList}
              contentContainerStyle={styles.chatListContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => {
                if (isSending) {
                  return (
                    <View
                      style={[
                        styles.messageContainer,
                        styles.aiMessageContainer,
                      ]}
                    >
                      <View
                        style={[styles.aiBubble, styles.thinkingBubbleContainer]}
                      >
                        <Animated.View
                          style={[
                            styles.thinkingDot,
                            { transform: [{ translateY: dot1 }] },
                          ]}
                        />
                        <Animated.View
                          style={[
                            styles.thinkingDot,
                            { transform: [{ translateY: dot2 }] },
                          ]}
                        />
                        <Animated.View
                          style={[
                            styles.thinkingDot,
                            { transform: [{ translateY: dot3 }] },
                          ]}
                        />
                      </View>
                    </View>
                  );
                }
                return null;
              }}
            />
          )}

          {/* Chat Input Bar */}
          <View style={styles.footerContainer}>
            {/* Plus Button */}
            <TouchableOpacity style={styles.plusBtn}>
              <Image
                source={images.plus}
                style={styles.plusIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Main Input Box */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder={localization.appkeys.chatInputPlaceholder}
                placeholderTextColor="rgba(58,33,16,0.4)"
                value={chatText}
                onChangeText={setChatText}
                maxFontSizeMultiplier={1.4}
              />
              <TouchableOpacity onPress={handleSend}>
                <Image
                  source={
                    chatText.trim().length > 0 ? images.send : images.microPhone
                  }
                  style={styles.micIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
};

export default HealyChat;
