import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import SolidText from '../../../../../components/SolidText';

interface WelcomeViewProps {
  logoSource: any;
  logoColor: string;
  welcomeText: string;
  styles: any;
  questions?: any[];
  onQuestionPress?: (question: string) => void;
}

const WelcomeViewComponent: React.FC<WelcomeViewProps> = ({
  logoSource,
  logoColor,
  welcomeText,
  styles,
  questions = [],
  onQuestionPress,
}) => {
  return (
    <View style={styles.welcomeContainer}>
      <Image
        source={logoSource}
        style={styles.logo}
        resizeMode="contain"
        tintColor={logoColor}
      />
      <SolidText style={styles.welcomeText}>{welcomeText}</SolidText>

      {questions && questions.length > 0 && (
        <View style={styles.questionsContainer}>
          {questions.slice(0, 5).map((item: any, index: number) => {
            const questionStr = typeof item === 'string' ? item : item?.question || item?.title || '';
            if (!questionStr) return null;
            return (
              <TouchableOpacity
                key={item._id || item.id || `q-${index}`}
                style={styles.questionChip}
                onPress={() => onQuestionPress?.(questionStr)}
                activeOpacity={0.7}
              >
                <SolidText style={styles.questionText}>{questionStr}</SolidText>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export const WelcomeView = React.memo(WelcomeViewComponent);
