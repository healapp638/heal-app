import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from '../../../../../components/SolidText';
import { LocalizationContext } from '../../../../../localization/localization';
import AppFonts from '../../../../../constants/fonts';
import AppUtils from '../../../../../utils/appUtils';
import { triggerHaptic } from '../../../../../hooks/useHaptic';

interface StreamingMessageTextProps {
  text: string;
  isLatest: boolean;
  style: any;
  onComplete?: () => void;
  showDisclaimer?: boolean;
  onStreamStart?: () => void;
}

// ─── Tuning knobs ────────────────────────────────────────────────────────────
const BASE_CHARS_PER_SECOND = 150; // Reveal speed (pacing matches ChatGPT)
const MAX_SPEED_MULTIPLIER = 1.9; // Max catch-up speed for large backlogs
const BACKLOG_RAMP_CHARS = 250; // Backlog size to trigger max catch-up speed
const FADE_WINDOW = 120; // Expanded fade window to span multiple words
const CURSOR_BLINK_MS = 530; // Cursor blink speed
const MAX_DELTA = 0.1; // Max time delta per frame to avoid jumps
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the display segments from the current animation state.
 *
 * Returns:
 * - staticText: all fully-revealed chars (before the fade window), single Text node
 * - fadeChars: the trailing FADE_WINDOW chars with per-char opacity
 * - isStreaming: whether the animation is still active
 */
const buildDisplayState = (
  count: number,
  fullText: string,
  streaming: boolean,
) => {
  const intCount = Math.min(Math.floor(count), fullText.length);

  if (!streaming || intCount >= fullText.length) {
    return {
      staticText: fullText,
      fadeChars: [] as { char: string; opacity: number }[],
      isStreaming: false,
    };
  }

  // Everything before the fade window is rendered as a single static string
  const fadeStart = Math.max(0, intCount - FADE_WINDOW);
  const staticPart = fullText.slice(0, fadeStart);
  const fadeChars: { char: string; opacity: number }[] = [];

  for (let i = fadeStart; i < intCount; i++) {
    // distFromEdge: FADE_WINDOW (oldest, fully opaque) to 1 (newest, transparent)
    const distFromEdge = intCount - i;
    // t: goes from 1 / FADE_WINDOW (newest) to 1 (oldest)
    const t = distFromEdge / FADE_WINDOW;
    // Cubic ease-in curve for a smooth transition tail
    const opacity = Math.pow(t, 1.6);
    fadeChars.push({ char: fullText[i], opacity });
  }

  return { staticText: staticPart, fadeChars, isStreaming: true };
};

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

  // ── Refs for animation state (mutated inside RAF, no re-render cost) ──────
  const fullTextRef = useRef(text || '');
  const visibleCountRef = useRef(isLatest ? 0 : text?.length ?? 0);
  const lastFrameRef = useRef(0);
  const rafRef = useRef(0);
  const startedRef = useRef(false);
  const completedRef = useRef(!isLatest);

  // ── React state for rendering (updated once per RAF frame) ────────────────
  const [displayState, setDisplayState] = useState(() => ({
    staticText: isLatest ? '' : text || '',
    fadeChars: [] as { char: string; opacity: number }[],
    isStreaming: isLatest && !!text,
  }));

  // ── Stable callback refs ──────────────────────────────────────────────────
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  const onStreamStartRef = useRef(onStreamStart);
  useEffect(() => {
    onStreamStartRef.current = onStreamStart;
  }, [onStreamStart]);

  // ── RAF animation loop ────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    if (rafRef.current) return;

    lastFrameRef.current = 0;

    const animate = (now: number) => {
      if (lastFrameRef.current === 0) {
        lastFrameRef.current = now;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = Math.min((now - lastFrameRef.current) / 1000, MAX_DELTA);
      lastFrameRef.current = now;

      const fullText = fullTextRef.current;
      const currentCount = visibleCountRef.current;
      const remaining = fullText.length - currentCount;

      // ── All text revealed ──
      if (remaining <= 0) {
        visibleCountRef.current = fullText.length;
        completedRef.current = true;
        rafRef.current = 0;

        setDisplayState({
          staticText: fullText,
          fadeChars: [],
          isStreaming: false,
        });

        onCompleteRef.current?.();
        triggerHaptic('impactMedium');
        return;
      }

      // ── Adaptive speed: ramp up proportionally to backlog ──
      const backlogRatio = Math.min(remaining / BACKLOG_RAMP_CHARS, 1);
      const speedMul = 1 + (MAX_SPEED_MULTIPLIER - 1) * backlogRatio;
      const advance = BASE_CHARS_PER_SECOND * speedMul * delta;

      visibleCountRef.current = Math.min(
        currentCount + advance,
        fullText.length,
      );

      // ── Push new display state ──
      setDisplayState(
        buildDisplayState(visibleCountRef.current, fullText, true),
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // ── Main streaming effect — responds to text / isLatest changes ───────────
  useEffect(() => {
    if (!isLatest || !text) return;

    const prevLen = fullTextRef.current.length;
    fullTextRef.current = text;

    if (!startedRef.current) {
      startedRef.current = true;
      completedRef.current = false;
      visibleCountRef.current = 0;
      onStreamStartRef.current?.();

      // Typing-like feedback: 3 fast beats at start of response
      triggerHaptic('impactLight');
      setTimeout(() => triggerHaptic('impactLight'), 100);
      setTimeout(() => triggerHaptic('impactLight'), 200);

      startLoop();
    } else if (completedRef.current && text.length > prevLen) {
      completedRef.current = false;
      startLoop();
    }
  }, [text, isLatest, startLoop]);

  // ── Handle becoming non-latest (e.g. user sends another message) ──────────
  useEffect(() => {
    if (!isLatest) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }

      startedRef.current = false;
      completedRef.current = true;
      visibleCountRef.current = text?.length ?? 0;
      fullTextRef.current = text || '';
      setDisplayState({
        staticText: text || '',
        fadeChars: [],
        isStreaming: false,
      });
    }
  }, [isLatest, text]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, []);

  // ── Disclaimer sub-component ──────────────────────────────────────────────
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

  const flatStyle = StyleSheet.flatten(style) || {};
  const baseColor = flatStyle.color || colors.brown || '#3A2110';

  const getHexColorWithOpacity = (
    colorStr: string,
    opacity: number,
  ): string => {
    let cleanColor = typeof colorStr === 'string' ? colorStr.trim() : '#3A2110';
    if (!cleanColor.startsWith('#')) {
      return cleanColor;
    }
    if (cleanColor.length === 4) {
      cleanColor =
        '#' +
        cleanColor[1] +
        cleanColor[1] +
        cleanColor[2] +
        cleanColor[2] +
        cleanColor[3] +
        cleanColor[3];
    }
    const hex6 = cleanColor.slice(0, 7);
    const alphaInt = Math.round(opacity * 255);
    const alphaHex = alphaInt.toString(16).padStart(2, '0').toUpperCase();
    return `${hex6}${alphaHex}`;
  };

  // ── Static render — not latest or done streaming ──────────────────────────
  if (!isLatest || !displayState.isStreaming) {
    return (
      <View style={internalStyles.container}>
        <SolidText style={style}>{text}</SolidText>
        {showDisclaimer && renderDisclaimer()}
      </View>
    );
  }

  // ── Streaming render ──────────────────────────────────────────────────────
  const { staticText, fadeChars } = displayState;

  return (
    <View style={internalStyles.container}>
      <SolidText style={style}>
        {/* Bulk static text — single node, zero per-char cost */}
        {staticText}
        {/* Fade window — only the trailing N chars have individual opacity */}
        {fadeChars.map((fc, i) => (
          <Text
            key={`f${i}`}
            style={{
              color: getHexColorWithOpacity(baseColor, fc.opacity),
            }}
          >
            {fc.char}
          </Text>
        ))}
      </SolidText>
      {showDisclaimer && !displayState.isStreaming && renderDisclaimer()}
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
