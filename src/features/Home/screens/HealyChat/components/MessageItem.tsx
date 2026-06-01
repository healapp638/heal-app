import React from 'react';
import { View } from 'react-native';
import SolidText from '../../../../../components/SolidText';
import StreamingMessageText from './StreamingMessageText';

interface MessageItemProps {
  item: any;
  isLatestAssistant: boolean;
  styles: any;
  logoSource: any;
  tintColor: string;
  onComplete: () => void;
}

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

const getMessageTime = (item: any) => {
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

const MessageItemComponent: React.FC<MessageItemProps> = ({
  item,
  isLatestAssistant,
  styles,
  onComplete,
}) => {
  const isUser = item.role === 'user';

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      {isUser ? (
        <View
          style={[
            styles.messageBubble,
            styles.userBubble,
          ]}
        >
          <SolidText style={styles.messageText}>{item.message}</SolidText>
        </View>
      ) : (
        <View style={{ flex: 1, paddingVertical: 4 }}>
          <StreamingMessageText
            text={item.message}
            isLatest={isLatestAssistant}
            style={styles.messageText}
            onComplete={onComplete}
          />
        </View>
      )}
    </View>
  );
};

// Custom comparison to ensure strict memoization
export const MessageItem = React.memo(
  MessageItemComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.item._id === nextProps.item._id &&
      prevProps.item.message === nextProps.item.message &&
      prevProps.isLatestAssistant === nextProps.isLatestAssistant &&
      prevProps.styles === nextProps.styles &&
      prevProps.logoSource === nextProps.logoSource &&
      prevProps.tintColor === nextProps.tintColor
    );
  }
);
