import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FlatList, Keyboard, Dimensions } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../../../../api/Manager/manager';
import { setConversationId as setReduxConversationId } from '../../../../../redux/Reducers/tempData';
import useGetApi from '../../../../../hooks/useGetApi';
import usePostApi from '../../../../../hooks/usePostApi';
import { endpoints } from '../../../../../api/Services/endpoints';
import { useNavigation } from '@react-navigation/native';
import { triggerHaptic } from '../../../../../hooks/useHaptic';

let isFreshAppLaunch = true;

export const useHealyChat = (
  flatListRef: React.RefObject<FlatList | null>,
  setCreditsModalVisible: (visible: boolean) => void,
) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [extraPadding, setExtraPadding] = useState(0);


  useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      // If the user leaves the screen, stop the sending state
      setIsSending(false);
      setExtraPadding(0);
      // Pre-scroll to the bottom so it's already there when user returns
      flatListRef.current?.scrollToEnd({ animated: false });
    });
    const unsubscribeFocus = navigation.addListener('focus', () => {
      // If the user returns to the screen, refetch to fetch latest status
      if (conversationId) {
        refetch();
      }
      // Scroll to the latest message when screen regains focus
      setShouldScrollOnLayout(true);
      setExtraPadding(0);
      // Also scroll after refetch may re-render the list
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 500);
    });
    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [navigation, conversationId, refetch, flatListRef]);

  const reduxConversationId = useSelector(
    (state: any) => state.tempData?.conversationId,
  );
  
  const [conversationId, setConversationId] = useState<string | null>(
    reduxConversationId || null,
  );

  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [prevConversationId, setPrevConversationId] = useState<string | null>(null);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastStreamedId, setLastStreamedId] = useState<string | null>(null);
  const [shouldAnimateNext, setShouldAnimateNext] = useState(false);
  const [shouldScrollOnLayout, setShouldScrollOnLayout] = useState(false);
  const [isNewChatRequested, setIsNewChatRequested] = useState(false);
  const messages = allMessages.slice(-visibleCount);
  const lastMessageRef = useRef<string | null>(null);
  const paginationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingScrollAfterSend = useRef(false);

  useEffect(() => {
    if (isFreshAppLaunch) {
      setIsNewChatRequested(true);
      isFreshAppLaunch = false;
    }
  }, []);

  useEffect(() => {
    if (conversationId !== null) {
      setIsNewChatRequested(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId && !isSending) {
      setShouldScrollOnLayout(true);
    }
  }, [conversationId]);

  // Fetch Message History
  const {
    data: chatData,
    refetch,
    isLoading: isHistoryLoading,
  } = useGetApi(endpoints.getMessageList, ['getMessageList', conversationId], {
    conversation_id: conversationId,
  }, {
    enabled: !isNewChatRequested && !!conversationId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (shouldScrollOnLayout && !isHistoryLoading && messages.length > 0) {
      const timer = setTimeout(() => {
        setShouldScrollOnLayout(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [shouldScrollOnLayout, isHistoryLoading, messages.length]);

  // Send Message Mutation
  const { mutate: sendMessageMutate } = usePostApi();

  // Fetch Random Questions for New Chat Welcome Screen
  const {
    data: randomQuestionsData,
    refetch: refetchRandomQuestions,
    isFetching: isRandomQuestionsFetching,
  } = useGetApi(endpoints.getRandomQuestions, ['getRandomQuestions'], {}, {
    enabled: false,
  });

    


  const randomQuestion =
    randomQuestionsData?.data?.question||""

  // Load messages from query response
  useEffect(() => {
    if (isNewChatRequested) {
      setAllMessages([]);
      setVisibleCount(10);
      setPrevConversationId(null);
      return;
    }

    // If we do not have an active conversation established yet,
    // do not attempt to overwrite our optimistic message with empty query data.
    if (!conversationId) {
      return;
    }

    if (isSending) {
      // Do not overwrite optimistic messages while sending is in progress
      return;
    }

    let rawResult = chatData?.data?.result || chatData?.result || [];

    const lastOptimisticUserMsg = allMessages.find(
      m => m.role === 'user' && typeof m._id === 'string' && m._id.startsWith('temp-user-')
    );

    if (lastOptimisticUserMsg && rawResult.length > 0) {
      let lastMatchIdx = -1;
      for (let i = rawResult.length - 1; i >= 0; i--) {
        const msg = rawResult[i];
        if (
          msg.role === 'user' &&
          msg.message === lastOptimisticUserMsg.message &&
          typeof msg._id === 'string' &&
          !msg._id.startsWith('temp-user-')
        ) {
          lastMatchIdx = i;
          break;
        }
      }
      if (lastMatchIdx !== -1) {
        rawResult = [
          ...rawResult.slice(0, lastMatchIdx),
          { ...rawResult[lastMatchIdx], _id: lastOptimisticUserMsg._id },
          ...rawResult.slice(lastMatchIdx + 1),
        ];
      }
    }

    if (conversationId !== prevConversationId) {
      // Brand new conversation load
      setPrevConversationId(conversationId);
      setAllMessages(rawResult);
      setVisibleCount(Math.min(10, rawResult.length));
    } else {
      // Same conversation refetch/update (e.g. after bot reply)
      const hasMoreMessages = rawResult.length > allMessages.length;
      const isLastIdDifferent =
        rawResult.length === allMessages.length &&
        rawResult.length > 0 &&
        rawResult[rawResult.length - 1]?._id !== allMessages[allMessages.length - 1]?._id;

      if (hasMoreMessages || isLastIdDifferent) {
        const diff = rawResult.length - allMessages.length;
        if (hasMoreMessages && allMessages.length > 0 && allMessages[allMessages.length - 1]?.role === 'user') {
          // If the user was waiting for response, and now we got new messages, animate the bot response
          setShouldAnimateNext(true);
        }
        setAllMessages(rawResult);
        if (diff > 0) {
          setVisibleCount(prev => Math.min(prev + diff, rawResult.length));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData, isNewChatRequested, conversationId, prevConversationId, allMessages.length, isSending]);

  // Synchronize isSending state and handle polling when the last message is from user (waiting for reply)
  const currentHistoryMessages = chatData?.data?.result || chatData?.result || [];
  const isLastMessageUser = currentHistoryMessages.length > 0 && currentHistoryMessages[currentHistoryMessages.length - 1]?.role === 'user';

  useEffect(() => {
    if (!isHistoryLoading) {
      if (isLastMessageUser) {
        setIsSending(true);
      } else if (isSending && !isLastMessageUser) {
        setIsSending(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData, isHistoryLoading, isLastMessageUser]);

  useEffect(() => {
    if (isSending && !isNewChatRequested && conversationId) {
      const lastMsg = allMessages[allMessages.length - 1];
      if (lastMsg && lastMsg.role === 'user') {
        const timer = setTimeout(() => {
          refetch();
        }, 3000); // Poll every 3 seconds while waiting for response
        return () => clearTimeout(timer);
      }
    }
  }, [allMessages, isSending, refetch, isNewChatRequested, conversationId]);

  // Synchronize conversation_id if found in history list
  useEffect(() => {
    if (isNewChatRequested) return;
    const apiConvId =
      chatData?.data?.conversation_id || chatData?.conversation_id;
    if (apiConvId && apiConvId !== conversationId) {
      setConversationId(apiConvId);
      dispatch(setReduxConversationId(apiConvId));
    }
  }, [chatData, conversationId, dispatch, isNewChatRequested]);

  // Reset extra padding when response is complete (isSending transitions from true to false)
  const prevIsSendingRef = useRef(false);
  const scrollOffsetYRef = useRef(0);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(Dimensions.get('window').height - 150); // Safe fallback
  const prevShouldAnimateRef = useRef(false);

  // Auto-scroll to end after response animation completes, if the response is long
  useEffect(() => {
    if (prevShouldAnimateRef.current && !shouldAnimateNext) {
      // Animation just finished — check if content overflows the viewport
      const contentHeight = contentHeightRef.current;
      const viewportHeight = viewportHeightRef.current;
      if (contentHeight > viewportHeight) {
        // Long response — scroll to end and keep some bottom padding
        // setTimeout(() => {
        //   flatListRef.current?.scrollToEnd({ animated: true });
        // }, 100);
        setTimeout(() => {
          setExtraPadding(200);
        }, 200);
      }
    }
    prevShouldAnimateRef.current = shouldAnimateNext;
  }, [shouldAnimateNext, flatListRef]);

  useEffect(() => {
    if (prevIsSendingRef.current && !isSending) {
      // Calculate the exact padding needed to keep the scroll position stable without jumping
      const currentScrollY = scrollOffsetYRef.current;
      const viewportHeight = viewportHeightRef.current;
      const currentContentHeight = contentHeightRef.current;

      const normalContentHeight = currentContentHeight - extraPadding;
      const targetHeight = currentScrollY + viewportHeight;

      // Exact padding needed = targetHeight - normalContentHeight
      const neededPadding = Math.max(0, targetHeight - normalContentHeight);
      setExtraPadding(neededPadding);
    }
    prevIsSendingRef.current = isSending;
  }, [isSending, extraPadding]);

  // Auto-scroll the last user message to the top of the viewport when messages update
  useEffect(() => {
    if (messages.length > 0) {
      const currentLastId = messages[messages.length - 1]?._id || messages[messages.length - 1]?.id;
      if (currentLastId !== lastMessageRef.current) {
        lastMessageRef.current = currentLastId;

        const lastMsg = messages[messages.length - 1];

        // When user sends a message, the scroll is handled by onContentSizeChange
        // via the pendingScrollAfterSend ref (set in handleSend).
        // This ensures the scroll fires AFTER the FlatList re-renders with the new extraPadding.
        if (lastMsg?.role === 'user') {
          // Stop onContentSizeChange from calling scrollToEnd (which fights our scroll)
          setShouldScrollOnLayout(false);
          // Scroll the user message to the TOP of the viewport
          const timer = setTimeout(() => {
            const userMsgIdx = messages.length - 1;
            flatListRef.current?.scrollToIndex({
              index: userMsgIdx,
              viewPosition: 0,
              viewOffset: -20,
              animated: true,
            });

            // For long messages: after the initial scroll positions the message
            // at the top, do a follow-up scroll to push the message further up
            // so only the last 1-2 lines are visible and the response area
            // gets ~80% of the screen.
            const msgText = lastMsg?.message || '';
            const lineCount = msgText.split('\n').length;
            const estimatedLines = Math.max(lineCount, Math.ceil(msgText.length / 35));

            // Only apply extra scroll for messages that are long enough to fill the screen
            if (estimatedLines > 5) {
              // Each line is roughly 28px high (font size + line spacing), plus bubble padding (~50px)
              const estimatedMsgHeight = estimatedLines * 28 + 50;
              // Keep only ~2 lines visible at the top
              const visibleMsgHeight = 2 * 28 + 50;
              // Extra scroll = message height that should be pushed above the viewport
              const extraScroll = Math.max(0, estimatedMsgHeight - visibleMsgHeight);

              if (extraScroll > 0) {
                if (messages.length === 1) {
                  // First message: FlatList just mounted from WelcomeView,
                  // needs longer delays for layout to settle. Offset starts at 0.
                  [300, 700].forEach(delay => {
                    setTimeout(() => {
                      flatListRef.current?.scrollToOffset({
                        offset: extraScroll,
                        animated: true,
                      });
                    }, delay);
                  });
                } else {
                  setTimeout(() => {
                    const currentOffset = scrollOffsetYRef.current;
                    flatListRef.current?.scrollToOffset({
                      offset: currentOffset + extraScroll,
                      animated: true,
                    });
                  }, 250);
                }
              }
            }
          }, 400);
          return () => clearTimeout(timer);
        } else if (lastMsg?.role === 'assistant') {
          // Auto-scroll to the end so the latest part of the response is visible,
          // especially for long responses that go beyond the screen
          pendingScrollAfterSend.current = false;
          const scrollToLatest = () => {
            flatListRef.current?.scrollToEnd({ animated: false });
          };
          // Fire at multiple intervals to beat all re-render cycles
          const timers = [50, 150, 300, 500].map(d => setTimeout(scrollToLatest, d));
          return () => timers.forEach(clearTimeout);
        }
      }
    }
  }, [messages, flatListRef]);

  // Handle pagination locally
  const loadMorePastMessages = useCallback(() => {
    if (isPaginationLoading) return;
    if (visibleCount < allMessages.length) {
      setIsPaginationLoading(true);
      paginationTimeoutRef.current = setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 10, allMessages.length));
        setIsPaginationLoading(false);
      }, 300);
    }
  }, [visibleCount, allMessages.length, isPaginationLoading]);

  const handleScroll = useCallback(
    (event: any) => {
      const { contentOffset } = event.nativeEvent;
      scrollOffsetYRef.current = contentOffset.y;
      if (contentOffset.y <= 10) {
        loadMorePastMessages();
      }
    },
    [loadMorePastMessages],
  );

  const handleContentSizeChange = useCallback(
    (w: number, h: number) => {
      contentHeightRef.current = h;
      if (shouldScrollOnLayout) {
        flatListRef.current?.scrollToEnd({ animated: false });
      }
    },
    [shouldScrollOnLayout, flatListRef],
  );

  const handleLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    viewportHeightRef.current = height;
  }, []);

  useEffect(() => {
    return () => {
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }
    };
  }, []);

  // Handle message submission
  const handleSend = useCallback((textToSend: string) => {
    if (textToSend.trim().length === 0) return;

    Keyboard.dismiss();
    triggerHaptic('impactMedium');

    const userMessageContent = textToSend.trim();

    // Optimistically add user's message to FlatList for real-time responsiveness
    const tempUserMsg = {
      _id: `temp-user-${Date.now()}`,
      role: 'user',
      message: userMessageContent,
      createdAt: new Date().toISOString(),
    };

    setAllMessages(prev => [...prev, tempUserMsg]);
    setVisibleCount(prev => prev + 1);
    setIsSending(true);
    setIsNewChatRequested(false);
    pendingScrollAfterSend.current = true;
    setExtraPadding(500);

    const payload = {
      role: 'user',
      conversation_id: conversationId, // First message sends null/empty
      message: userMessageContent,
      question: !conversationId ? (randomQuestion || '') : '',
    };
    // console.log('Sending message payload:', payload);

    sendMessageMutate(
      {
        endpoint: endpoints.sendMessage,
        data: payload,
      },
      
      {
        onSuccess: async (res: any) => {
          if (res?.data?.total_credit === 0) {
            setCreditsModalVisible(true);
          }
          const newConvId =
            res?.data?.conversation_id ||
            res?.conversation_id ||
            res?.data?.id ||
            res?.id;

          setShouldAnimateNext(true);

          if (newConvId && newConvId !== conversationId) {
            setConversationId(newConvId);
            dispatch(setReduxConversationId(newConvId));

            // Fetch the history for the new conversation ID directly using queryClient
            // to update the cache and prevent blinking/lag
            try {
              const fetchParams = { conversation_id: newConvId };
              const data = await queryClient.fetchQuery({
                queryKey: ['getMessageList', newConvId],
                queryFn: async () => {
                  const response = await api.get(endpoints.getMessageList, fetchParams);
                  if (!response.ok) {
                    throw new Error(
                      (response.data as any)?.message ||
                        response.problem ||
                        'Something went wrong',
                    );
                  }
                  return response.data;
                },
              });

              let rawResult = data?.data?.result || data?.result || [];
              
              const lastOptimisticUserMsg = allMessages.find(
                m => m.role === 'user' && typeof m._id === 'string' && m._id.startsWith('temp-user-')
              );

              if (lastOptimisticUserMsg && rawResult.length > 0) {
                rawResult = rawResult.map((msg: any) => {
                  if (
                    msg.role === 'user' &&
                    msg.message === lastOptimisticUserMsg.message &&
                    typeof msg._id === 'string' &&
                    !msg._id.startsWith('temp-user-')
                  ) {
                    return { ...msg, _id: lastOptimisticUserMsg._id };
                  }
                  return msg;
                });
              }

              setAllMessages(rawResult);
              setVisibleCount(Math.min(10, rawResult.length));
              setPrevConversationId(newConvId);
            } catch (err) {
              console.log('Failed to fetch initial messages for new conversation:', err);
            }
          } else {
            // Existing conversation: manually trigger refetch to fetch bot response
            await refetch();
          }

          // Delay hiding ThinkingBubble until the assistant message has mounted
          setTimeout(() => {
            setIsSending(false);
          }, 150);
        },
        onError: (err: any) => {
          console.log('sendMessage error:', err);
          setIsSending(false);
        },
      },
    );
  }, [conversationId, dispatch, refetch, sendMessageMutate, flatListRef, queryClient, setCreditsModalVisible, randomQuestion]);

  const startNewChat = useCallback(() => {
    setConversationId(null);
    setPrevConversationId(null);
    setAllMessages([]);
    setVisibleCount(10);
    setLastStreamedId(null);
    setShouldAnimateNext(false);
    dispatch(setReduxConversationId(null));
    setIsNewChatRequested(true);
    refetchRandomQuestions();
  }, [dispatch, refetchRandomQuestions]);

  const firstAssistantMessage = allMessages.find(msg => msg.role !== 'user');
  const firstAssistantMessageId = firstAssistantMessage
    ? firstAssistantMessage._id || firstAssistantMessage.id
    : null;

  return {
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
    extraPadding,
    randomQuestion,
    isRandomQuestionsFetching,
    loadMorePastMessages,
    isPaginationLoading,
    allMessagesLength: allMessages.length,
    visibleCount,
    firstAssistantMessageId,
    pendingScrollAfterSend,
    handleScroll,
    handleContentSizeChange,
    handleLayout,
  };
};
