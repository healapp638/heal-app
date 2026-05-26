import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Image, TextInput } from 'react-native';

interface ChatInputBarProps {
  onSend: (text: string) => void;
  placeholder: string;
  plusIconSource: any;
  sendIconSource: any;
  micIconSource: any;
  styles: any;
}

const ChatInputBarComponent: React.FC<ChatInputBarProps> = ({
  onSend,
  placeholder,
  plusIconSource,
  sendIconSource,
  micIconSource,
  styles,
}) => {
  const [chatText, setChatText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSendPress = useCallback(() => {
    if (chatText.trim().length === 0) return;
    onSend(chatText);
    setChatText('');
  }, [chatText, onSend]);

  const isTextEmpty = chatText.trim().length === 0;

  return (
    <View style={styles.footerContainer}>
      {/* Plus Button */}
      <TouchableOpacity style={styles.plusBtn}>
        <Image
          source={plusIconSource}
          style={styles.plusIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Main Input Box */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder={isFocused ? '' : placeholder}
          placeholderTextColor="rgba(58,33,16,0.4)"
          value={chatText}
          onChangeText={setChatText}
          maxFontSizeMultiplier={1.4}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity onPress={handleSendPress}>
          <Image
            source={isTextEmpty ? micIconSource : sendIconSource}
            style={styles.micIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const ChatInputBar = React.memo(ChatInputBarComponent);
