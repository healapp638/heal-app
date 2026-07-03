import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import SolidText from './SolidText';
import HeaderCommon from './HeaderCommon';

interface ExerciseReflectionProps {
  question: string;
  placeholder: string;
  defaultValue: string;
  onChangeText: (text: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  handleBack: () => void;
  localization: any;
  styles: any;
}

const ExerciseReflection = React.memo(({
  question,
  placeholder,
  defaultValue,
  onChangeText,
  isFocused,
  onFocus,
  onBlur,
  handleBack,
  localization,
  styles,
}: ExerciseReflectionProps) => {
  const [localText, setLocalText] = useState(defaultValue || '');

  const handleChangeText = (text: string) => {
    setLocalText(text);
    onChangeText(text);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
      }}
    >
      <HeaderCommon
        title={localization.appkeys?.exercise || 'Exercise'}
        onBackPress={handleBack}
        viewStyle={{ marginBottom: -2, width: '100%' }}
      />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <View style={styles.reflectionCard}>
          <SolidText style={styles.reflectionQuestion}>
            {question}
          </SolidText>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder={isFocused ? '' : placeholder}
            placeholderTextColor="grey"
            value={localText}
            onChangeText={handleChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            maxFontSizeMultiplier={1.4}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
});

export default ExerciseReflection;
