import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FlatList, Keyboard } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../../../../api/Manager/manager';
import { setConversationId as setReduxConversationId } from '../../../../../redux/Reducers/tempData';
import useGetApi from '../../../../../hooks/useGetApi';
import usePostApi from '../../../../../hooks/usePostApi';
import { endpoints } from '../../../../../api/Services/endpoints';
import { triggerHaptic } from '../../../../../hooks/useHaptic';

let isFreshAppLaunch = true;

export const useHealyChat = (flatListRef: React.RefObject<FlatList | null>) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

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
    if (conversationId) {
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

    const rawResult = chatData?.data?.result || chatData?.result || [];
    if (conversationId !== prevConversationId) {
      // Brand new conversation load
      setPrevConversationId(conversationId);
      setAllMessages(rawResult);
      setVisibleCount(Math.min(10, rawResult.length));
    } else {
      // Same conversation refetch/update (e.g. after bot reply)
      const diff = rawResult.length - allMessages.length;
      setAllMessages(rawResult);
      if (diff > 0) {
        setVisibleCount(prev => Math.min(prev + diff, rawResult.length));
      }
    }
  }, [chatData, isNewChatRequested, conversationId, prevConversationId, allMessages.length, isSending]);

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

  // Auto-scroll to the bottom when new messages arrive or when sending, avoiding jumps during pagination
  useEffect(() => {
    if (messages.length > 0) {
      const currentLastId = messages[messages.length - 1]?._id || messages[messages.length - 1]?.id;
      if (currentLastId !== lastMessageRef.current || isSending) {
        lastMessageRef.current = currentLastId;
        const timer = setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [messages, isSending, flatListRef]);

  // Handle pagination locally
  const loadMorePastMessages = useCallback(() => {
    if (isPaginationLoading) return;
    if (visibleCount < allMessages.length) {
      setIsPaginationLoading(true);
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 10, allMessages.length));
        setIsPaginationLoading(false);
      }, 300);
    }
  }, [visibleCount, allMessages.length, isPaginationLoading]);

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

    sendMessageMutate(
      {
        endpoint: endpoints.sendMessage,
        data: {
          role: 'user',
          conversation_id: conversationId, // First message sends null/empty
          message: userMessageContent,
        },
      },
      {
        onSuccess: async (res: any) => {

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

              const rawResult = data?.data?.result || data?.result || [];
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

          setIsSending(false);
          // Scroll to end after bot reply is loaded into the list
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }, 300);
        },
        onError: (err: any) => {
          console.log('sendMessage error:', err);
          setIsSending(false);
        },
      },
    );
  }, [conversationId, dispatch, refetch, sendMessageMutate, flatListRef, queryClient]);

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

    randomQuestion,
    loadMorePastMessages,
    isPaginationLoading,
    allMessagesLength: allMessages.length,
    visibleCount,
  };
};
