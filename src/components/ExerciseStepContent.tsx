import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import SolidText from './SolidText';
import HeaderCommon from './HeaderCommon';
import ExerciseOptionCard from './ExerciseOptionCard';
import AppFonts from '../constants/fonts';

interface ExerciseStepContentProps {
  currentStep: number;
  currentStepData: any;
  selectedOptionId: string | undefined;
  handleSelectOption: (optionId: string) => void;
  handleBack: () => void;
  localization: any;
  styles: any;
}

const ExerciseStepContent = React.memo(({
  currentStep,
  currentStepData,
  selectedOptionId,
  handleSelectOption,
  handleBack,
  localization,
  styles,
}: ExerciseStepContentProps) => {
  const scrollStyle = useMemo(() => [
    styles.scrollContent,
    (currentStepData.type === 'text' || currentStepData.type === 'mcq') && { paddingBottom: 120 },
  ], [styles.scrollContent, currentStepData.type]);

  const titleStyle = useMemo(() => [
    styles.exerciseTitle,
    currentStepData.type === 'text'
      ? {
          textAlign: 'left',
          alignSelf: 'flex-start',
          fontFamily: AppFonts.semiBold,
        }
      : {
          fontFamily: AppFonts.medium,
        },
  ], [styles.exerciseTitle, currentStepData.type]);

  return (
    <ScrollView
      style={{ width: '100%', flex: 1 }}
      contentContainerStyle={scrollStyle}
      showsVerticalScrollIndicator={false}
    >
      <HeaderCommon
        title={localization.appkeys?.exercise || 'Exercise'}
        onBackPress={handleBack}
        viewStyle={{ marginBottom: -2, width: '100%' }}
      />

      {/* Step Number */}
      <SolidText style={styles.numberText}>
        {currentStep + 1}
      </SolidText>

      {/* Title */}
      <SolidText
        maxFontScale={1.2}
        style={titleStyle}
      >
        {currentStepData.title}
      </SolidText>

      {/* Reading Text / MCQ options */}
      {currentStepData.type === 'text' ? (
        <SolidText
          maxFontScale={1.2}
          style={styles.exerciseDescription}
        >
          {currentStepData.description}
        </SolidText>
      ) : (
        <View style={styles.optionList}>
          {currentStepData?.options?.map((optionItem: any, index: number) => {
            const isSelected = selectedOptionId === optionItem._id;
            return (
              <ExerciseOptionCard
                key={optionItem._id ? `${optionItem._id}_${index}` : index}
                optionItem={optionItem}
                isSelected={isSelected}
                onPress={() => handleSelectOption(optionItem._id)}
                styles={styles}
              />
            );
          })}
        </View>
      )}
    </ScrollView>
  );
});

export default ExerciseStepContent;
