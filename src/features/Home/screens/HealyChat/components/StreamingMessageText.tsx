import React, { useState, useEffect } from 'react';
import SolidText from '../../../../components/SolidText';

interface StreamingMessageTextProps {
  text: string;
  isLatest: boolean;
  style: any;
  logoHStyle: any;
  logoDotStyle: any;
  onComplete?: () => void;
}

const StreamingMessageText: React.FC<StreamingMessageTextProps> = ({
  text,
  isLatest,
  style,
  logoHStyle,
  logoDotStyle,
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
      }, 15); // 15ms character rate for fluid, premium typing transitions
      return () => clearInterval(interval);
    } else {
      setDisplayedText(text);
    }
  }, [text, isLatest]);

  return (
    <SolidText style={style}>
      {displayedText}
      <SolidText style={logoHStyle}> h</SolidText>
      <SolidText style={logoDotStyle}>.</SolidText>
    </SolidText>
  );
};

export default StreamingMessageText;
