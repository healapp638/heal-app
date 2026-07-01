import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import style from './AddJournalStyle';
import AppUtils from '../../../../utils/appUtils';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@dev-amirzubair/react-native-voice';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetail } from '../../../../redux/Reducers/userData';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import PremiumModal from '../../../../modals/PremiumModal';
import { showPointsToast } from '../../../../components/TopPointsToast';
const SPEECH_LOCALE_BY_LANGUAGE: Record<string, string> = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  German: 'de-DE',
  Russian: 'ru-RU',
  Portuguese: 'pt-PT',
  Italian: 'it-IT',
};
const AddJournal = () => {
  const dispatch = useDispatch();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [titleText, setTitleText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isBodyFocused, setIsBodyFocused] = useState(false);
  const { mutate: createJournal, isPending: loading } = usePostApi();
  const navigation = useNavigation();

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bodyBeforeSTT = useRef('');
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);

  // ---------- Voice listeners ----------
  useEffect(() => {
    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      const transcript = e.value?.[0] ?? '';
      if (transcript) {
        const prefix = bodyBeforeSTT.current;
        setBodyText(prefix ? `${prefix} ${transcript}` : transcript);
      }
    };
    const onSpeechResults = (e: SpeechResultsEvent) => {
      const transcript = e.value?.[0] ?? '';
      if (transcript) {
        const prefix = bodyBeforeSTT.current;
        setBodyText(prefix ? `${prefix} ${transcript}` : transcript);
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
      bodyBeforeSTT.current = bodyText;
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
  }, [bodyText, appLanguage]);

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
  const handleSave = async () => {
    if (selectedEmotion == '') {
      AppUtils.showToast(
        localization.appkeys?.pleaseSelectEmotion || 'Please select emotion',
      );
      return;
    }
    if (!titleText.trim()) {
      AppUtils.showToast(
        localization.appkeys?.titleRequired || 'Please enter a title',
      );
      return;
    }
    if (!bodyText.trim()) {
      AppUtils.showToast(
        localization.appkeys?.bodyRequired || 'Please express what you feel',
      );
      return;
    }
    createJournal(
      {
        endpoint: endpoints.create_journal,
        data: {
          title: titleText.trim(),
          description: bodyText.trim(),
          feeling: selectedEmotion,
        },
      },
      {
        onSuccess: (data: any) => {
          showPointsToast(data?.message, `+${data?.data?.points} ${(localization.appkeys?.pts || 'pts').toLowerCase()}`);
          dispatch(getUserDetail() as any);
          navigation.goBack();
        },
        onError: (error: any) => {
          AppUtils.showToast(error.message || 'Failed to save journal entry');
        },
      },
    );
  };
  const emotions = [
    {
      id: 'calm',
      label: localization.appkeys?.feelingCalm || 'Calm',
      image: images.calm,
    },
    {
      id: 'sad',
      label: localization.appkeys?.feelingSad || 'Sad',
      image: images.sad,
    },
    {
      id: 'happy',
      label: localization.appkeys?.feelingHappy || 'Happy',
      image: images.happy,
    },
    {
      id: 'sorrow',
      label: localization.appkeys?.feelingSorrow || 'Sorrow',
      image: images.sorrow,
    },
    {
      id: 'thoughtful',
      label: localization.appkeys?.feelingThoughtful || 'Thoughtful',
      image: images.thoughtful,
    },
    {
      id: 'hopeful',
      label: localization.appkeys?.feelingHopeful || 'Hopeful',
      image: images.hope,
    },
  ];
  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          {/* Header */}
          <HeaderCommon
            title={localization.appkeys?.addJournalHeaderTitle || 'New Entry'}
          />

          {/* Titles */}
          <SolidText style={styles.title}>
            {localization.appkeys?.addJournalTitle || 'New entry'}
          </SolidText>
          <SolidText style={styles.dateText}>
            {(() => {
              const MONTHS = [
                localization.appkeys?.monthJan || 'January',
                localization.appkeys?.monthFeb || 'February',
                localization.appkeys?.monthMar || 'March',
                localization.appkeys?.monthApr || 'April',
                localization.appkeys?.monthMay || 'May',
                localization.appkeys?.monthJun || 'June',
                localization.appkeys?.monthJul || 'July',
                localization.appkeys?.monthAug || 'August',
                localization.appkeys?.monthSep || 'September',
                localization.appkeys?.monthOct || 'October',
                localization.appkeys?.monthNov || 'November',
                localization.appkeys?.monthDec || 'December',
              ];
              const currentDate = new Date();
              const day = currentDate.getDate();
              const monthName = MONTHS[currentDate.getMonth()];
              const year = currentDate.getFullYear();
              return `${day} ${monthName} ${year}`;
            })()}
          </SolidText>

          {/* Emotions Section */}
          <SolidText style={styles.sectionTitle}>
            {localization.appkeys?.howAreYouFeeling || 'How are you feeling?'}
          </SolidText>
          <View style={styles.gridContainer}>
            {emotions.map(emotion => (
              <TouchableOpacity
                key={emotion.id}
                activeOpacity={0.8}
                onPress={() => {
                  triggerHaptic('impactMedium');
                  return setSelectedEmotion(emotion.id);
                }}
                style={[
                  styles.emotionCard,
                  selectedEmotion === emotion.id && styles.emotionCardSelected,
                ]}
              >
                <Image
                  source={emotion.image}
                  style={styles.emotionImage}
                  resizeMode="cover"
                  defaultSource={emotion.image}
                />
                <SolidText maxFontScale={1} style={styles.emotionText}>
                  {emotion.label}
                </SolidText>
                {selectedEmotion === emotion.id && (
                  <Image
                    source={images.selected}
                    style={styles.selectedOverlay}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            maxFontSizeMultiplier={1.4}
            placeholder={
              isTitleFocused
                ? ''
                : localization.appkeys?.entryTitlePlaceholder ||
                  'Title of your entry...'
            }
            placeholderTextColor="black"
            value={titleText}
            onChangeText={setTitleText}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
          />

          {/* Body Input */}
          <View style={styles.bodyContainer}>
            <TextInput
              style={styles.bodyInput}
              maxFontSizeMultiplier={1.4}
              placeholder={
                isBodyFocused
                  ? ''
                  : localization.appkeys?.entryBodyPlaceholder ||
                    'Express what you feel... This space is yours, without judgment. 🤍'
              }
              placeholderTextColor="black"
              multiline
              value={bodyText}
              onChangeText={setBodyText}
              textAlignVertical="top"
              onFocus={() => setIsBodyFocused(true)}
              onBlur={() => setIsBodyFocused(false)}
            />
            {/* Mic Button with pulse animation */}
            <Animated.View
              style={[
                styles.micIconContainer,
                {
                  transform: [
                    {
                      scale: pulseAnim,
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                onPress={(...args: any) => {
                  triggerHaptic('impactMedium');
                  return (toggleListening as any)(...args);
                }}
                activeOpacity={0.7}
                style={isListening ? styles.micButtonActive : undefined}
              >
                <Image
                  source={images.microphone2}
                  style={[
                    styles.micIcon,
                    isListening && {
                      tintColor: '#FFFFFF',
                    },
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Animated.View>
            {isListening && (
              <SolidText style={styles.listeningText}>
                {localization.appkeys?.listening || 'Listening...'}
              </SolidText>
            )}
          </View>

          {/* Save Button */}
          <SolidBtn
            titleTxt={localization.appkeys?.saveMyEntry || 'Save my entry'}
            btnStyle={styles.saveButton}
            isLoading={loading}
            disabled={loading}
            onPress={(...args: any) => {
              triggerHaptic('impactMedium');
              return (handleSave as any)(...args);
            }}
          />
          <PremiumModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};
export default AddJournal;
