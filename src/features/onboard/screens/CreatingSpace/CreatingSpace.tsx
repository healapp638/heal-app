import React, { useEffect, useRef, useState, useContext } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderCommon from '../../../../components/HeaderCommon';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

const CHAR_INTERVAL_MS = 28;
const SENTENCE_PAUSE_MS = 700;

const CreatingSpace = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const sentences = [
    localization.appkeys?.welcomeSentence1,
    localization.appkeys?.welcomeSentence2,
  ];

  const [displayedTexts, setDisplayedTexts] = useState<string[]>(['', '']);
  const [activeSentence, setActiveSentence] = useState(0);
  const [activeChar, setActiveChar] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;

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
  }, [activeSentence, activeChar, allDone, sentences]);

  const handleContinue = () => {
    // Navigate home for now as it's the end of the onboarding flow
    navigation.navigate(AppRoutes.AccessScreen as never);
  };

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 20 }}>
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
                          style={[styles.cursor, { opacity: cursorOpacity }]}
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

          <View style={{ flex: 1 }} />

          <Animated.View
            style={[styles.btnContainer, { opacity: buttonOpacity }]}
          >
            <SolidBtn
              titleTxt={localization.appkeys?.startHealing}
              onPress={handleContinue}
            />
          </Animated.View>
        </View>
      }
    />
  );
};

export default CreatingSpace;
