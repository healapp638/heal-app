import { Animated, Image, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderCommon from '../../../../components/HeaderCommon';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';

const CHAR_INTERVAL_MS = 28;
const SENTENCE_PAUSE_MS = 700;

const CreatingSpace = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const styles = style(colors);

  const sentences = [
    'Welcome to Heal! We’re here to support you on your journey towards clarity & Connection.',
    'It’s okay to feel stuck sometimes; you’re not alone in this. Take a moment to breath and know you’ve made an important step today.',
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
    navigation.navigate(AppRoutes.Home as never);
  };

  return (
    <SolidView
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 20 }}>
            <HeaderCommon title="Creating space" />
          </View>

          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {allDone ? 'You’re All Set, B!' : 'Creating your space...'}
            </SolidText>

            {!allDone && (
              <SolidText style={styles.subtitle}>
                it might take a minute or two...
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
            <SolidBtn titleTxt="Start Healing" onPress={handleContinue} />
          </Animated.View>
        </View>
      }
    />
  );
};

export default CreatingSpace;
