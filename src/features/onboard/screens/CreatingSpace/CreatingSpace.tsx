import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { Animated, Image, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderCommon from '../../../../components/HeaderCommon';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserDetail,
  setOnboardingCompleted,
  setOnboardingCurrentScreen,
} from '../../../../redux/Reducers/userData';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const CHAR_INTERVAL_MS = 28;
const SENTENCE_PAUSE_MS = 700;
const CreatingSpace = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const answers = useSelector(
    (state: any) => state.userData?.onboarding?.answers,
  );
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const token = useSelector((state: any) => state.userData?.token);
  const { mutate: completeOnboardingApi } = usePostApi();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const sentences = useMemo(
    () => [
      localization.appkeys?.welcomeSentence1 || '',
      localization.appkeys?.welcomeSentence2 || '',
    ],
    [
      localization.appkeys?.welcomeSentence1,
      localization.appkeys?.welcomeSentence2,
    ],
  );
  const [displayedTexts, setDisplayedTexts] = useState<string[]>(['', '']);
  const [activeSentence, setActiveSentence] = useState(0);
  const [activeChar, setActiveChar] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.CreatingSpace));
    }, [dispatch]),
  );

  // Blinking cursor logic
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );
    blink.start();
    return () => blink.stop();
  }, [cursorOpacity]);

  // Typewriter logic
  useEffect(() => {
    if (allDone) return;
    if (activeSentence >= sentences.length) {
      setAllDone(true);
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
      return;
    }
    const sentence = sentences[activeSentence];
    if (activeChar < sentence.length) {
      const timer = setTimeout(() => {
        setDisplayedTexts(prev => {
          const next = [...prev];
          next[activeSentence] = sentence.slice(0, activeChar + 1);
          return next;
        });
        setActiveChar(c => c + 1);
      }, CHAR_INTERVAL_MS);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setActiveSentence(s => s + 1);
        setActiveChar(0);
      }, SENTENCE_PAUSE_MS);
      return () => clearTimeout(timer);
    }
  }, [activeSentence, activeChar, allDone, buttonOpacity, sentences]);
  const handleContinue = () => {
    dispatch(setOnboardingCompleted(true));
    if (token) {
      completeOnboardingApi(
        {
          endpoint: endpoints.complete_onboarding,
          data: {
            language: AppUtils.getLanguageCode(appLanguage) || 'en',
            fullName: answers?.fullName || '',
            goalStartWith: answers?.goalStartWith || '',
            timeYouCommit: answers?.timeYouCommit || '',
            stopFeelBetter: answers?.stopFeelBetter || '',
            helpFeelBetter: answers?.helpFeelBetter || '',
            likeToFellMore: answers?.likeToFellMore || '',
            feelThatWay: answers?.feelThatWay || '',
            howFellingLately: answers?.howFellingLately || '',
            hearAboutUs: answers?.hearAboutUs || '',
          },
        },
        {
          onSuccess: (res: any) => {
            console.log('complete_onboarding response:', res);
            dispatch(getUserDetail() as any);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: AppRoutes.NonAuthStack,
                  params: {
                    screen: AppRoutes.Offer,
                  },
                } as never,
              ],
            });
          },
          onError: (err: any) => {
            console.log('complete_onboarding error:', err);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: AppRoutes.NonAuthStack,
                  params: {
                    screen: AppRoutes.Offer,
                  },
                } as never,
              ],
            });
          },
        },
      );
    } else {
      navigation.navigate(AppRoutes.AccessScreen as never);
    }
  };
  return (
    <SolidView
      isScrollEnabled
      viewStyle={{
        flex: 1,
      }}
      view={
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              paddingHorizontal: 20,
            }}
          >
            <HeaderCommon title={localization.appkeys?.creatingSpaceHeader} />
          </View>

          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {allDone
                ? localization.appkeys?.allSetB
                : localization.appkeys?.creatingSpaceTitle}
            </SolidText>

            {!allDone && (
              <SolidText style={styles.subtitle}>
                {localization.appkeys?.takeMinuteSubtitle}
              </SolidText>
            )}

            <Image
              source={images.bird}
              style={styles.gif}
              resizeMode="stretch"
            />

            <View style={styles.textContainer}>
              {sentences.map((sentence, i) =>
                displayedTexts[i].length > 0 ? (
                  <View key={i} style={styles.sentenceRow}>
                    <SolidText style={styles.sentence}>
                      {displayedTexts[i]}
                      {activeSentence === i && activeChar < sentence.length && (
                        <Animated.Text
                          style={[
                            styles.cursor,
                            {
                              opacity: cursorOpacity,
                            },
                          ]}
                        >
                          {'|'}
                        </Animated.Text>
                      )}
                    </SolidText>
                  </View>
                ) : null,
              )}
            </View>
          </View>

          <View
            style={{
              flex: 1,
            }}
          />

          <Animated.View
            style={[
              styles.btnContainer,
              {
                opacity: buttonOpacity,
              },
            ]}
          >
            <SolidBtn
              titleTxt={localization.appkeys?.startHealing}
              onPress={(...args: any) => {
                return (handleContinue as any)(...args);
              }}
            />
          </Animated.View>
        </View>
      }
    />
  );
};
export default CreatingSpace;
