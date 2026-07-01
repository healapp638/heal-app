import React from 'react';
import { TouchableOpacity } from 'react-native';
import SolidText from './SolidText';

interface ExerciseOptionCardProps {
  optionItem: any;
  isSelected: boolean;
  onPress: () => void;
  styles: any;
}

const ExerciseOptionCard = React.memo(({
  optionItem,
  isSelected,
  onPress,
  styles,
}: ExerciseOptionCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.optionCard,
        isSelected && styles.optionCardSelected,
      ]}
      onPress={onPress}
    >
      <SolidText
        maxFontScale={1.2}
        style={[
          styles.optionText,
          isSelected && styles.optionTextSelected,
        ]}
      >
        {optionItem.option}
      </SolidText>
    </TouchableOpacity>
  );
});

export default ExerciseOptionCard;
