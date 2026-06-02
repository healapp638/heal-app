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
  showDisclaimer?: boolean;
}



const MessageItemComponent: React.FC<MessageItemProps> = ({
  item,
  isLatestAssistant,
  styles,
  onComplete,
  showDisclaimer,
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
            showDisclaimer={showDisclaimer}
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
      prevProps.showDisclaimer === nextProps.showDisclaimer &&
      prevProps.styles === nextProps.styles &&
      prevProps.logoSource === nextProps.logoSource &&
      prevProps.tintColor === nextProps.tintColor
    );
  }
);
