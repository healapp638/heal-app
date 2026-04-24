import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, BackHandler } from 'react-native';
import {
  CommonActions,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidBtn from '../../../../components/SolidBtn';
import SuccessModal from '../../../../modals/SuccessModal';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';

const ModuleExercise = () => {
  const { colors } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;

  const steps = [
    {
      type: 'number',
      text:
        localization.appkeys?.moduleExerciseStep1 ||
        'Think of the person you call your best friend.',
    },
    {
      type: 'number',
      prefixText:
        localization.appkeys?.moduleExerciseStep2Prefix ||
        'Mentally identify: ',
      text:
        localization.appkeys?.moduleExerciseStep2 ||
        'what makes this bond different from others?',
    },
    {
      type: 'number',
      text:
        localization.appkeys?.moduleExerciseStep3 ||
        "What does it give you that you don't find elsewhere?",
    },
    {
      type: 'reflection',
      title:
        localization.appkeys?.moduleExerciseReflectionTitle || 'Reflection',
      question:
        localization.appkeys?.moduleExerciseReflectionQuestion ||
        'What is the most important quality in a friendship for you?',
      instruction:
        localization.appkeys?.moduleExerciseReflectionInstruction ||
        'In your head or on paper, take the time to answer honestly.',
      placeholder:
        localization.appkeys?.moduleExerciseReflectionPlaceholder ||
        'Express what you feel. This space is yours, without judgment.',
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
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
      setShowModal(true);
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
                  placeholderTextColor="black"
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
          />

          <SuccessModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            title={localization.appkeys?.wellDone || 'Well done'}
            subtitle={
              localization.appkeys?.completedPhase1 ||
              "You've completed Phase 1"
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
