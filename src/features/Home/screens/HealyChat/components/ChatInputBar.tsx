import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Platform,
  PermissionsAndroid,
  Alert,
  Text,
} from 'react-native';
import { LocalizationContext } from '../../../../../localization/localization';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@dev-amirzubair/react-native-voice';
import { useSelector } from 'react-redux';
import { triggerHaptic } from '../../../../../hooks/useHaptic';
import AppUtils from '../../../../../utils/appUtils';

const SPEECH_LOCALE_BY_LANGUAGE: Record<string, string> = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  German: 'de-DE',
  Russian: 'ru-RU',
  Portuguese: 'pt-PT',
  Italian: 'it-IT',
};

interface ChatInputBarProps {
  onSend: (text: string) => void;
  placeholder: string;
  plusIconSource: any;
  sendIconSource: any;
  micIconSource: any;
  styles: any;
  isDisabled?: boolean;
}

const ChatInputBarComponent: React.FC<ChatInputBarProps> = ({
  onSend,
  placeholder,
  plusIconSource,
  sendIconSource,
  micIconSource,
  styles,
  isDisabled = false,
}) => {
  const { localization } = useContext(LocalizationContext) as any;
  const [chatText, setChatText] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const [isMultiline, setIsMultiline] = useState(false);
  const singleLineHeight = useRef<number>(0);
  const textInputRef = useRef<TextInput>(null);

  const [textInputWidth, setTextInputWidth] = useState(0);

  const handleTextInputLayout = useCallback((e: any) => {
    setTextInputWidth(e.nativeEvent.layout.width);
  }, []);

  const handleContentSizeChange = useCallback((e: any) => {
    if (Platform.OS === 'android') return;
    const contentHeight = e.nativeEvent.contentSize.height;
    // Capture the single-line baseline height on first measurement
    if (singleLineHeight.current === 0) {
      singleLineHeight.current = contentHeight;
    }
    setInputHeight(contentHeight);
    if (
      singleLineHeight.current > 0 &&
      contentHeight > singleLineHeight.current * 1.3
    ) {
      setIsMultiline(true);
    }
  }, []);

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textBeforeSTT = useRef('');
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);

  // ---------- Voice listeners ----------
  useEffect(() => {
    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      const transcript = e.value?.[0] ?? '';
      if (transcript) {
        const prefix = textBeforeSTT.current;
        setChatText(prefix ? `${prefix} ${transcript}` : transcript);
      }
    };
    const onSpeechResults = (e: SpeechResultsEvent) => {
      const transcript = e.value?.[0] ?? '';
      if (transcript) {
        const prefix = textBeforeSTT.current;
        setChatText(prefix ? `${prefix} ${transcript}` : transcript);
      }
    };
    const onSpeechError = (_e: SpeechErrorEvent) => setIsListening(false);
    const onSpeechEnd = () => setIsListening(false);

    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechEnd = onSpeechEnd;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // ---------- Pulse animation ----------
  useEffect(() => {
    if (isListening) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    pulseAnim.setValue(1);
  }, [isListening, pulseAnim]);

  // ---------- Android mic permission ----------
  const ensureMicPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    if (micGranted) return true;
    try {
      const alreadyGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (alreadyGranted) {
        setMicGranted(true);
        return true;
      }
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'Heal needs microphone access to transcribe your speech.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      const granted = result === PermissionsAndroid.RESULTS.GRANTED;
      setMicGranted(granted);
      return granted;
    } catch {
      return false;
    }
  }, [micGranted]);

  // ---------- Start speech recognition ----------
  const startSpeechRecognition = useCallback(async () => {
    try {
      textBeforeSTT.current = chatText;
      const locale = SPEECH_LOCALE_BY_LANGUAGE[appLanguage] || 'en-US';
      const available = await Voice.isAvailable();
      if (!available) {
        AppUtils.showToast(
          'Speech recognition is not available on this device.',
        );
        return;
      }
      await Voice.destroy();
      await Voice.start(locale);
      setIsListening(true);
    } catch (e: any) {
      console.warn('Speech start error:', e);
      AppUtils.showToast('Failed to start speech recognition.');
    }
  }, [chatText, appLanguage]);

  // ---------- Toggle listening ----------
  const toggleListening = useCallback(async () => {
    if (isListening) {
      try {
        await Voice.stop();
      } catch {}
      setIsListening(false);
      return;
    }
    const hasPermission = await ensureMicPermission();
    if (!hasPermission) {
      Alert.alert(
        'Microphone Access Required',
        'Please enable microphone access in your device Settings to use speech-to-text.',
        [
          {
            text: 'OK',
          },
        ],
      );
      return;
    }
    startSpeechRecognition();
  }, [isListening, ensureMicPermission, startSpeechRecognition]);

  const handleSendPress = useCallback(() => {
    if (chatText.trim().length === 0) return;
    if (isListening) {
      Voice.stop().catch(() => {});
      setIsListening(false);
    }
    const textToSend = chatText; // capture before clearing
    setChatText('');
    setInputHeight(0);
    setIsMultiline(false);
    textInputRef.current?.clear();
    onSend(textToSend);
  }, [chatText, onSend, isListening]);

  const showMic = isListening || chatText.trim().length === 0;

  const handleMicPress = useCallback(async () => {
    triggerHaptic('impactMedium');
    await toggleListening();
  }, [toggleListening]);

  const handleButtonPress = useCallback(() => {
    if (showMic) {
      handleMicPress();
    } else {
      handleSendPress();
    }
  }, [showMic, handleMicPress, handleSendPress]);

  const handleTextChange = useCallback(
    (text: string) => {
      setChatText(text);
      if (text.trim().length === 0) {
        setInputHeight(0); // Reset height if text is cleared manually
        setIsMultiline(false);
      }
      if (isListening && text.trim().length > 0) {
        Voice.stop().catch(() => {});
        setIsListening(false);
      }
    },
    [isListening],
  );

  return (
    <View style={styles.footerContainer}>
      {/* Main Input Box */}
      <View
        style={[
          styles.inputWrapper,
          isMultiline
            ? {
                height: Math.min(
                  240,
                  inputHeight + (Platform.OS === 'ios' ? 50 : 42),
                ),
                paddingBottom: 36,
              }
            : undefined,
        ]}
      >
        <TextInput
          ref={textInputRef}
          style={[
            styles.textInput,
            {
              paddingTop: Platform.OS === 'ios' ? 6 : 0,
              paddingBottom: Platform.OS === 'ios' ? 6 : 0,
              flex: isMultiline ? 1 : 0.9,
            },
          ]}
          // spellCheck={true}
          // autoCorrect={true}
          placeholder={
            isListening
              ? localization?.appkeys?.listening || 'Listening...'
              : placeholder
          }
          placeholderTextColor={isListening ? '#EA4335' : 'rgba(58,33,16,0.4)'}
          value={chatText}
          onChangeText={handleTextChange}
          maxFontSizeMultiplier={1.4}
          multiline={true}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleTextInputLayout}
        />
        {Platform.OS === 'android' && textInputWidth > 0 && (
          <Text
            style={[
              styles.textInput,
              {
                position: 'absolute',
                top: -9999,
                left: -9999,
                opacity: 0,
                width: textInputWidth,
              },
            ]}
            onTextLayout={e => {
              const contentHeight = e.nativeEvent.lines.reduce(
                (acc, line) => acc + line.height,
                0,
              );
              if (singleLineHeight.current === 0 && contentHeight > 0) {
                singleLineHeight.current = contentHeight;
              }
              setInputHeight(contentHeight);
              if (
                singleLineHeight.current > 0 &&
                contentHeight > singleLineHeight.current * 1.3
              ) {
                setIsMultiline(true);
              }
            }}
          >
            {chatText || ' '}
          </Text>
        )}
        <TouchableOpacity
          onPress={handleButtonPress}
          activeOpacity={0.7}
          disabled={isDisabled}
          style={
            isMultiline
              ? {
                  position: 'absolute',
                  bottom: Platform.OS === 'ios' ? 6 : 4,
                  right: 0,
                  padding: 8,
                }
              : {
                  position: 'absolute',
                  bottom: Platform.OS === 'ios' ? 6 : 4,
                  right: 0,
                  padding: 8,
                }
          }
        >
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
              opacity: isDisabled ? 0.3 : 1,
            }}
          >
            <Image
              source={showMic ? micIconSource : sendIconSource}
              style={[styles.micIcon, isListening && { tintColor: '#EA4335' }]}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const ChatInputBar = React.memo(ChatInputBarComponent);
