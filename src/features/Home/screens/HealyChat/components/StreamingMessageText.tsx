import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
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

  useEffect(() => {
    if (isLatest && text) {
      setDisplayedText('');
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(interval);
          if (onComplete) {
            onComplete();
          }
        }
      }, 15); // Fluid typing transition
      return () => clearInterval(interval);
    } else {
      setDisplayedText(text);
    }
  }, [text, isLatest]);

  return (
    <SolidText style={style}>
      {displayedText}{'  '}
      <Image
        source={logoSource}
        style={logoStyle}
        tintColor={tintColor}
        resizeMode="contain"
      />
    </SolidText>
  );
};

export default StreamingMessageText;
