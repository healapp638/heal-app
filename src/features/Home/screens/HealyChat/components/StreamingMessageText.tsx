import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from '../../../../../components/SolidText';
import { LocalizationContext } from '../../../../../localization/localization';
import AppFonts from '../../../../../constants/fonts';
import AppUtils from '../../../../../utils/appUtils';

interface StreamingMessageTextProps {
  text: string;
  isLatest: boolean;
  style: any;
  onComplete?: () => void;
  showDisclaimer?: boolean;
  onStreamStart?: () => void;
}

// ─── Tuning knobs ────────────────────────────────────────────────────────────
const WORD_INTERVAL_MS = 38; // ms per word — fast & smooth
const BUNCH_SIZE = 2; // words revealed per tick after slow phase
const SLOW_WORD_COUNT = 8; // first N words are one-by-one

// 20-step ultra-smooth gradient tail
// Follows a cubic ease-in curve: starts almost invisible, builds gradually
const FADE_TAIL_LENGTH = 20;
const getOpacity = (wordsBack: number): number => {
  if (wordsBack >= FADE_TAIL_LENGTH) return 1;
  // cubic ease-in: slow start → accelerates toward 1
  const t = wordsBack / FADE_TAIL_LENGTH;
  return Math.pow(t, 1.6); // 1.6 power = smooth but visible gradient
};
// ─────────────────────────────────────────────────────────────────────────────

const StreamingMessageText: React.FC<StreamingMessageTextProps> = ({
  text,
  isLatest,
  style,
  onComplete,
  showDisclaimer,
  onStreamStart,
}) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const internalStyles = useStyle(colors);

  const [visibleCount, setVisibleCount] = useState(isLatest ? 0 : Infinity);
  const [isDone, setIsDone] = useState(!isLatest);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  const onStreamStartRef = useRef(onStreamStart);
  useEffect(() => {
    onStreamStartRef.current = onStreamStart;
  }, [onStreamStart]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);
  const visibleRef = useRef(0);
  const slowCountRef = useRef(0); // tracks actual non-space words revealed

  const words = text ? text.split(/(\s+)/).filter(Boolean) : [];

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isLatest || !text) return;

    clearTimer();

    if (!startedRef.current) {
      startedRef.current = true;
      onStreamStartRef.current?.();
    }

    setIsDone(false);
    visibleRef.current = 0;
    slowCountRef.current = 0;

    const tick = () => {
      const isSlow = slowCountRef.current < SLOW_WORD_COUNT;
      const increment = isSlow ? 1 : BUNCH_SIZE;
      const next = Math.min(visibleRef.current + increment, words.length);

      // Count actual words (non-whitespace) in newly revealed tokens
      for (let i = visibleRef.current; i < next; i++) {
        if (words[i] && !/^\s+$/.test(words[i])) slowCountRef.current++;
      }

      visibleRef.current = next;
      setVisibleCount(next);

      if (next >= words.length) {
        clearTimer();
        setIsDone(true);
        setVisibleCount(Infinity);
        onCompleteRef.current?.();
      }
    };

    intervalRef.current = setInterval(tick, WORD_INTERVAL_MS);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isLatest]);

  useEffect(() => {
    if (!isLatest) {
      clearTimer();
      startedRef.current = false;
      visibleRef.current = 0;
      slowCountRef.current = 0;
      setVisibleCount(Infinity);
      setIsDone(true);
    }
  }, [isLatest]);

  const renderDisclaimer = () => (
    <View style={internalStyles.disclaimerContainer}>
      <Image
        source={images.h}
        style={internalStyles.disclaimerLogo}
        tintColor={colors.primary}
        resizeMode="contain"
      />
      <SolidText style={internalStyles.disclaimerText}>
        {localization.appkeys.healyIsAiAndCanMakeMistakes ||
          'Healy is AI and can make mistakes.\nPlease double-check responses.'}
      </SolidText>
    </View>
  );

  // Static — past or done
  if (!isLatest || isDone) {
    return (
      <View style={internalStyles.container}>
        <SolidText style={style}>{text}</SolidText>
        {showDisclaimer && renderDisclaimer()}
      </View>
    );
  }

  // Streaming — word by word with smooth gradient tail
  const flatStyle = StyleSheet.flatten(style) || {};
  const baseColor = flatStyle.color || colors.brown || '#3A2110';

  const getHexColorWithOpacity = (colorStr: string, opacity: number): string => {
    let cleanColor = typeof colorStr === 'string' ? colorStr.trim() : '#3A2110';
    if (!cleanColor.startsWith('#')) {
      return cleanColor;
    }
    if (cleanColor.length === 4) {
      cleanColor = '#' + cleanColor[1] + cleanColor[1] + cleanColor[2] + cleanColor[2] + cleanColor[3] + cleanColor[3];
    }
    const hex6 = cleanColor.slice(0, 7);
    const alphaInt = Math.round(opacity * 255);
    const alphaHex = alphaInt.toString(16).padStart(2, '0').toUpperCase();
    return `${hex6}${alphaHex}`;
  };

  return (
    <View style={internalStyles.container}>
      <Text style={style}>
        {words.map((word, idx) => {
          if (idx >= visibleCount) return null;

          const distFromFront = visibleCount - 1 - idx;
          const opacity = getOpacity(distFromFront);

          if (opacity >= 0.999) return <Text key={idx}>{word}</Text>;

          return (
            <Text
              key={idx}
              style={{
                color: getHexColorWithOpacity(baseColor, opacity),
              }}
            >
              {word}
            </Text>
          );
        })}
      </Text>
      {showDisclaimer && renderDisclaimer()}
    </View>
  );
};

const useStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      width: '100%',
    },
    disclaimerContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 14,
      width: '100%',
    },
    disclaimerLogo: {
      width: 22,
      height: 22,
      marginRight: 8,
      marginTop: 2,
    },
    disclaimerText: {
      flex: 1,
      fontSize: AppUtils.fontSize(11.5),
      fontFamily: AppFonts.regular,
      color: (colors.brown || '#3A2110') + '73',
      lineHeight: 16,
    },
  });

export default StreamingMessageText;
