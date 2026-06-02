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

  useEffect(() => {
    if (isLatest && text) {
      setIsDone(false);
      setDisplayedText('');
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(interval);
          setIsDone(true);
          if (onComplete) {
            onComplete();
          }
        }
      }, 15); // Fluid typing transition
      return () => clearInterval(interval);
    } else {
      setDisplayedText(text);
      setIsDone(true);
    }
  }, [text, isLatest, onComplete]);

  return (
    <View style={{ alignItems: 'flex-start', width: '100%' }}>
      <SolidText style={style}>{displayedText}</SolidText>
      <View style={styles.disclaimerContainer}>
        <Image
          source={images.h}
          style={styles.disclaimerLogo}
          tintColor={colors.primary}
          resizeMode="contain"
        />
        {showDisclaimer && (
          <SolidText style={styles.disclaimerText}>
            {localization.appkeys.healyIsAiAndCanMakeMistakes || "Healy is AI and can make mistakes.\nPlease double-check responses."}
          </SolidText>
        )}
      </View>
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
