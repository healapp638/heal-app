import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import SolidText from '../../../../../components/SolidText';

interface StreamingMessageTextProps {
  text: string;
  isLatest: boolean;
  style: any;
  logoSource: any;
  logoStyle: any;
  tintColor?: string;
  onComplete?: () => void;
}

const StreamingMessageText: React.FC<StreamingMessageTextProps> = ({
  text,
  isLatest,
  style,
  logoSource,
  logoStyle,
  tintColor,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(!isLatest);

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
  }, [text, isLatest]);

  return (
    <View style={{ alignItems: 'flex-start' }}>
      <SolidText style={style}>{displayedText}</SolidText>
      {isDone && (
        <Image
          source={logoSource}
          style={[logoStyle, { marginTop: 6 }]}
          tintColor={tintColor}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default StreamingMessageText;
