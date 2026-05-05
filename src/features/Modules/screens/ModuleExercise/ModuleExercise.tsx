import React, { useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { View, TextInput, BackHandler } from 'react-native';
import {
  CommonActions,
  useNavigation,
  useTheme,
  useRoute,
} from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidBtn from '../../../../components/SolidBtn';
import SuccessModal from '../../../../modals/SuccessModal';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { ToastService } from '../../../../utils/ToastManager';

const ModuleExercise = () => {
  const { colors } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const queryClient = useQueryClient();

  const route = useRoute();
  const { lesson, phase, exercises = [] } = (route.params as any) || {};

  const steps = [
    ...exercises.map((ex: any) => ({
      type: ex.type || 'number',
      text: ex.description || ex.text || '',
      prefixText: ex.prefix_text || '',
      title:
        ex.title ||
        localization.appkeys?.moduleExerciseReflectionTitle ||
        'Reflection',
      question: ex.question || '',
      instruction: ex.instruction || '',
      placeholder: ex.placeholder || '',
    })),
    {
      type: 'reflection',
      title:
        lesson?.reflection_title ||
        localization.appkeys?.moduleExerciseReflectionTitle ||
        'Reflection',
      question:
        lesson?.reflection_question ||
        localization.appkeys?.moduleExerciseReflectionQuestion ||
        'What is the most important quality in a friendship for you?',
      instruction:
        lesson?.reflection_instruction ||
        localization.appkeys?.moduleExerciseReflectionInstruction ||
        'In your head or on paper, take the time to answer honestly.',
      placeholder:
        lesson?.reflection_placeholder ||
        localization.appkeys?.moduleExerciseReflectionPlaceholder ||
        'Express what you feel. This space is yours, without judgment.',
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

  const { mutate: completeLesson, isPending: isCompleting } = usePostApi();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!reflectionText.trim()) {
        ToastService.show(
          localization.appkeys?.pleaseEnterReflection ||
            'Please enter your reflection',
        );
        return;
      }

      const lastExerciseId =
        exercises.length > 0 ? exercises[exercises.length - 1]._id : '';

      completeLesson(
        {
          endpoint: endpoints.complete_lesson,
          data: {
            reflection: reflectionText,
            phase_id: phase?._id,
            exercise_details_id: lesson?._id,
            exercise_id: lastExerciseId,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['phase_list'] });
            queryClient.invalidateQueries({ queryKey: ['module_list'] });
            setShowModal(true);
          },
        },
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.exercise || 'Exercise'}
            onBackPress={handleBack}
          />

          <View style={styles.contentContainer}>
            {currentStepData.type === 'number' ? (
              <>
                <SolidText style={styles.numberText}>
                  {currentStep + 1}
                </SolidText>
                <SolidText style={styles.descriptionText}>
                  {currentStepData.prefixText && (
                    <SolidText
                      style={[styles.descriptionText, styles.pinkText]}
                    >
                      {currentStepData.prefixText}
                    </SolidText>
                  )}
                  {currentStepData.text}
                </SolidText>
              </>
            ) : (
              <View style={styles.reflectionCard}>
                <SolidText style={styles.reflectionTitle}>
                  {currentStepData.title}
                </SolidText>
                <SolidText style={styles.reflectionQuestion}>
                  {currentStepData.question}
                </SolidText>
                <SolidText style={styles.reflectionInstruction}>
                  {currentStepData.instruction}
                </SolidText>
                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder={currentStepData.placeholder}
                  placeholderTextColor="grey"
                  value={reflectionText}
                  onChangeText={setReflectionText}
                  maxFontSizeMultiplier={1.4}
                  textAlignVertical="top"
                />
              </View>
            )}
          </View>

          <SolidBtn
            titleTxt={
              currentStep === steps.length - 1
                ? localization.appkeys?.completed || 'Completed'
                : localization.appkeys?.next || 'Next'
            }
            onPress={handleNext}
            btnStyle={styles.nextButton}
            isLoading={isCompleting}
          />

          <SuccessModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            title={localization.appkeys?.wellDone || 'Well done'}
            subtitle={
              localization.appkeys?.completedPhase ||
              `You've completed ${phase?.phase || 'Phase 1'}`
            }
            btnLabel={localization.appkeys?.continue || 'Continue'}
            onPressBtn={() => {
              setShowModal(false);
              navigation.dispatch(state => {
                const index = state.routes.findIndex(
                  (r: any) => r.name === AppRoutes.StartedModule,
                );
                if (index !== -1) {
                  return CommonActions.reset({
                    ...state,
                    routes: state.routes.slice(0, index + 1),
                    index,
                  });
                }
                return CommonActions.navigate({
                  name: AppRoutes.StartedModule,
                });
              });
            }}
            subStyle={{ marginTop: -8, marginBottom: 20 }}
            btnStyle={{ marginTop: 0, marginBottom: -4 }}
          />
        </View>
      }
    />
  );
};

export default ModuleExercise;
