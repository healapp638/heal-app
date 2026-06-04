import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from '../../../../../components/SolidText';
import api from '../../../../../api/Manager/manager';
import { endpoints } from '../../../../../api/Services/endpoints';
import { LocalizationContext } from '../../../../../localization/localization';
import { triggerHaptic } from '../../../../../hooks/useHaptic';
import AppFonts from '../../../../../constants/fonts';
import AppUtils from '../../../../../utils/appUtils';

interface ConversationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  styles: any;
}

const { width: screenWidth } = Dimensions.get('window');

// Date Formatter matching high-end design aesthetics
const formatConversationDate = (dateString: string, localization: any) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const todayStr = localization?.appkeys?.timeToday || 'Today';
    const yesterdayStr = localization?.appkeys?.timeYesterday || 'Yesterday';

    if (diffDays <= 1) {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      return `${todayStr}, ${hours}:${minutesStr} ${ampm}`;
    } else if (diffDays <= 2) {
      return yesterdayStr;
    } else {
      const months = [
        localization?.appkeys?.monthJan?.substring(0, 3) || 'Jan',
        localization?.appkeys?.monthFeb?.substring(0, 3) || 'Feb',
        localization?.appkeys?.monthMar?.substring(0, 3) || 'Mar',
        localization?.appkeys?.monthApr?.substring(0, 3) || 'Apr',
        localization?.appkeys?.monthMay?.substring(0, 3) || 'May',
        localization?.appkeys?.monthJun?.substring(0, 3) || 'Jun',
        localization?.appkeys?.monthJul?.substring(0, 3) || 'Jul',
        localization?.appkeys?.monthAug?.substring(0, 3) || 'Aug',
        localization?.appkeys?.monthSep?.substring(0, 3) || 'Sep',
        localization?.appkeys?.monthOct?.substring(0, 3) || 'Oct',
        localization?.appkeys?.monthNov?.substring(0, 3) || 'Nov',
        localization?.appkeys?.monthDec?.substring(0, 3) || 'Dec',
      ];
      return `${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
    }
  } catch {
    return '';
  }
};

const ConversationDrawerComponent: React.FC<ConversationDrawerProps> = ({
  isOpen,
  onClose,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  styles,
}) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const touchCoordinates = useRef({ pageX: 0, pageY: 0, locationY: 0 });

  const [conversations, setConversations] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // New States for Context Menu and Deletion Modal
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  // Load conversations from paginated API endpoint
  const fetchConversations = useCallback(
    async (targetPage: number, isInitial: boolean = false) => {
      if (loading || (targetPage > 1 && !hasMore)) return;

      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await api.get(endpoints.getConversationList, {
          page: targetPage,
          limit: 15,
        });

        if (response.ok) {
          const result =
            (response.data as any)?.data?.result ||
            (response.data as any)?.result ||
            [];

          if (isInitial) {
            setConversations(result);
          } else {
            setConversations(prev => [...prev, ...result]);
          }

          setPage(targetPage);
          setHasMore(result.length >= 15);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [loading, hasMore],
  );

  // Trigger animations and data fetches when drawer visibility changes
  useEffect(() => {
    if (isOpen) {
      slideAnim.setValue(screenWidth);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      fetchConversations(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Animate drawer out before calling callback triggers
  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  }, [slideAnim, onClose]);

  const handleSelect = useCallback(
    (id: string) => {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        onSelectConversation(id);
        onClose();
      });
    },
    [slideAnim, onSelectConversation, onClose],
  );

  const handleNewChat = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onNewChat();
      onClose();
    });
  }, [slideAnim, onNewChat, onClose]);

  const handlePressIn = useCallback((event: any) => {
    const { pageX, pageY, locationY } = event.nativeEvent;
    touchCoordinates.current = { pageX, pageY, locationY };
  }, []);

  const handleLongPress = useCallback((item: any) => {
    triggerHaptic('impactLight');

    const { pageX, pageY, locationY } = touchCoordinates.current;
    setSelectedConversation(item);

    const itemTopY = pageY - locationY;
    const itemHeight = 72;

    // Position the menu to overlap only the bottom part of the selected item (leaving the title visible)
    const calculatedTop = itemTopY + 40;
    const calculatedLeft = screenWidth * 0.22 + (screenWidth * 0.78 - 200) / 2;

    setMenuPosition({
      top: calculatedTop,
      left: calculatedLeft,
    });
    setMenuVisible(true);
  }, []);

  const handleDeleteInstant = useCallback(
    async (item: any) => {
      if (!item) return;

      const idToDelete = item._id || item.id;

      try {
        setLoading(true);

        const response = await api.delete(endpoints.deleteConversation, {
          conversation_id: idToDelete,
        });

        if (response.ok) {
          setConversations(prev =>
            prev.filter(c => c._id !== idToDelete && c.id !== idToDelete),
          );

          if (idToDelete === activeConversationId) {
            onNewChat();
          }

          AppUtils.showToast(
            localization?.appkeys?.conversationDeleted ||
              'Conversation deleted successfully',
          );
        } else {
          AppUtils.showToast(
            (response.data as any)?.message || 'Failed to delete conversation',
          );
        }
      } catch (error) {
        console.error('Error deleting conversation:', error);
        AppUtils.showToast('Something went wrong');
      } finally {
        setLoading(false);
        setSelectedConversation(null);
      }
    },
    [activeConversationId, onNewChat, localization],
  );

  const renderConversationItem = useCallback(
    ({ item }: { item: any }) => {
      const isActive =
        item._id === activeConversationId || item.id === activeConversationId;

      const isSelectedForDeletion =
        !!selectedConversation &&
        ((!!item._id && item._id === selectedConversation._id) ||
          (!!item.id && item.id === selectedConversation.id));

      // Use fallback title if backend doesn't return a custom title
      const title =
        item.title ||
        item.lastMessage ||
        localization?.appkeys?.chatSessionFallback ||
        'Chat Session';

      return (
        <TouchableOpacity
          style={[
            styles.drawerListItem,
            isActive && styles.drawerListItemActive,
            isSelectedForDeletion && {
              borderColor: '#E53E3E',
              backgroundColor: '#E53E3E12',
            },
          ]}
          onPress={() => {
            if (menuVisible) {
              setMenuVisible(false);
              setSelectedConversation(null);
            } else {
              handleSelect(item._id || item.id);
            }
          }}
          onPressIn={handlePressIn}
          onLongPress={() => handleLongPress(item)}
          activeOpacity={0.7}
        >
          <View pointerEvents="none">
            <SolidText
              style={styles.drawerListItemText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </SolidText>
            <SolidText style={styles.drawerListItemDate}>
              {formatConversationDate(
                item.createdAt || item.updatedAt,
                localization,
              )}
            </SolidText>
          </View>
        </TouchableOpacity>
      );
    },
    [
      activeConversationId,
      handleSelect,
      styles,
      localization,
      handlePressIn,
      handleLongPress,
      menuVisible,
      selectedConversation,
    ],
  );

  const keyExtractor = useCallback((item: any) => {
    return item._id || item.id || `drawer-conv-${Math.random()}`;
  }, []);

  const handleEndReached = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchConversations(page + 1);
    }
  }, [loading, loadingMore, hasMore, page, fetchConversations]);

  if (!isOpen) return null;

  return (
    <View style={styles.drawerOverlay}>
      {/* Clickable Backdrop overlay */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.drawerBackdrop} />
      </TouchableWithoutFeedback>

      {/* Sliding card panel */}
      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Drawer Header */}
        <View style={styles.drawerHeader}>
          <SolidText style={styles.drawerTitle}>
            {localization?.appkeys?.chatHistory || 'History'}
          </SolidText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.closeBtn, { marginRight: 12 }]}
              onPress={handleNewChat}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image
                source={images.newChat}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image
                source={images.cross}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Paginated Conversations List */}
        {loading && conversations.length === 0 ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ flex: 1, justifyContent: 'center' }}
          />
        ) : conversations.length === 0 ? (
          <SolidText style={styles.drawerEmptyText}>
            {localization?.appkeys?.noConversationsFound ||
              'No past conversations found.'}
          </SolidText>
        ) : (
          <FlatList
            data={conversations}
            renderItem={renderConversationItem}
            keyExtractor={keyExtractor}
            style={styles.drawerList}
            showsVerticalScrollIndicator={false}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2}
            ListFooterComponent={() => {
              if (loadingMore) {
                return (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={styles.drawerLoader}
                  />
                );
              }
              return null;
            }}
          />
        )}
      </Animated.View>

      {/* Context Menu Modal (Centered above the selected item) */}
      {menuVisible && selectedConversation && (
        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setMenuVisible(false);
            setSelectedConversation(null);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setMenuVisible(false);
              setSelectedConversation(null);
            }}
          >
            <View style={localStyles.menuOverlay}>
              <View
                style={[
                  localStyles.contextMenu,
                  {
                    top: menuPosition.top,
                    left: menuPosition.left,
                  },
                ]}
              >
                <TouchableOpacity
                  style={localStyles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    handleDeleteInstant(selectedConversation);
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={images.cross}
                    style={localStyles.menuItemIcon}
                    resizeMode="contain"
                  />
                  <SolidText style={localStyles.menuItemText}>
                    {localization?.appkeys?.deleteConversation ||
                      'Delete Conversation'}
                  </SolidText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  menuOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contextMenu: {
    position: 'absolute',
    width: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(58, 33, 16, 0.06)',
    zIndex: 9999,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 14,
    height: 14,
    marginRight: 10,
    tintColor: '#E53E3E',
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: AppFonts.medium || 'Outfit-Medium',
    color: '#E53E3E',
  },
});

export const ConversationDrawer = React.memo(ConversationDrawerComponent);

