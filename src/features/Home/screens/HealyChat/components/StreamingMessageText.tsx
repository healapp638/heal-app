import React, { useState, useEffect, useContext } from 'react';
import { View, Image, StyleSheet } from 'react-native';
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
}

const StreamingMessageText: React.FC<StreamingMessageTextProps> = ({
  text,
  isLatest,
  style,
  onComplete,
  showDisclaimer,
}) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = useStyle(colors);

  const [displayedText, setDisplayedText] = useState('');
  const [, setIsDone] = useState(!isLatest);

  const onCompleteRef = React.useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isLatest && text) {
      setIsDone(false);
      setDisplayedText('');
      
      // Split the text into alternating word and whitespace tokens
      const tokens = text.split(/(\s+)/).filter(Boolean);
      
      let tokenIndex = 0;
      const interval = setInterval(() => {
        if (tokenIndex < tokens.length) {
          // Get text up to the current token index, and trim trailing space to avoid native collapse
          let nextText = tokens.slice(0, tokenIndex + 1).join('').trimEnd();
          
          // Fast-forward tokenIndex past consecutive whitespace tokens if they don't change the trimmed text
          while (tokenIndex + 1 < tokens.length) {
            const peekText = tokens.slice(0, tokenIndex + 2).join('').trimEnd();
            if (peekText === nextText) {
              tokenIndex++;
              nextText = peekText;
            } else {
              break;
            }
          }
          
          setDisplayedText(nextText);
          tokenIndex++;
        } else {
          clearInterval(interval);
          setIsDone(true);
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }
      }, 45); // Smooth word-by-word streaming transition
      
      return () => clearInterval(interval);
    } else {
      setDisplayedText(text);
      setIsDone(true);
    }
  }, [text, isLatest]);

  return (
    <View style={{ alignItems: 'flex-start', width: '100%' }}>
      <SolidText style={style}>{displayedText}</SolidText>
      {showDisclaimer && (
        <View style={styles.disclaimerContainer}>
          <Image
            source={images.h}
            style={styles.disclaimerLogo}
            tintColor={colors.primary}
            resizeMode="contain"
          />
          <SolidText style={styles.disclaimerText}>
            {localization.appkeys.healyIsAiAndCanMakeMistakes || "Healy is AI and can make mistakes.\nPlease double-check responses."}
          </SolidText>
        </View>
      )}
    </View>
  );
};

const useStyle = (colors: any) =>
  StyleSheet.create({
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
      color: (colors.brown || '#3A2110') + '73', // Dynamic muted brown (45% opacity)
      lineHeight: 16,
    },
  });

export default StreamingMessageText;
