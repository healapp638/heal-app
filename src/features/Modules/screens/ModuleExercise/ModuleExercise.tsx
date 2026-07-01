/*
 * Refactoring Info:
 * - useCallbacks added: 5 (handleSelectOption, handleNext, handleBack, handleFocus, handleBlur)
 * - useMemos added: 6 (mcqList, steps, currentStepData, selectedOptionId, isCompletingOrSavingAnswer, nextButtonStyles)
 * - components extracted: 4
 *   - src/components/ExerciseLoading.tsx
 *   - src/components/ExerciseOptionCard.tsx
 *   - src/components/ExerciseReflection.tsx
 *   - src/components/ExerciseStepContent.tsx
 * - memory leak fixes applied: 2 (isMounted ref guard in mutate callbacks, proper BackHandler cleanup)
 */

import React, { useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { BackHandler, Keyboard, View } from 'react-native';
import { CommonActions, useNavigation, useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

import { endpoints } from '../../../../api/Services/endpoints';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import SolidBtn from '../../../../components/SolidBtn';
import SolidView from '../../../../components/SolidView';
import { showPointsToast } from '../../../../components/TopPointsToast';
import useGetApi from '../../../../hooks/useGetApi';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import usePostApi from '../../../../hooks/usePostApi';
import { LocalizationContext } from '../../../../localization/localization';
import { getUserDetail } from '../../../../redux/Reducers/userData';
import { ToastService } from '../../../../utils/ToastManager';
import style from './style';

import ExerciseLoading from '../../../../components/ExerciseLoading';
import ExerciseReflection from '../../../../components/ExerciseReflection';
import ExerciseStepContent from '../../../../components/ExerciseStepContent';

const ModuleExercise = () => {
  const { colors } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const phase = useSelector((state: any) => state.tempData.modulePhase);
  const isLastPhase = useSelector(
    (state: any) => state.tempData.moduleIsLastPhase,
  );
  const source = useSelector((state: any) => state.tempData.moduleSource);

  const { data: mcqData, isLoading: isMcqLoading } = useGetApi(
    endpoints.exercise_mcq_list,
    ['exercise_mcq_list', phase?._id],
    {
      phase_id: phase?._id,
    },
  );

  const { mutate: completeLesson, isPending: isCompleting } = usePostApi();
  const { isPending: isSavingAnswer } = usePostApi();

  // Refs
  const isMounted = useRef(true);

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [reflectionText, setReflectionText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

  // Derived / memoized values
  const mcqList = useMemo(() => {
    return (mcqData as any)?.data?.mcqList || [];
  }, [mcqData]);

  const steps = useMemo(() => {
    return [
      ...mcqList.map((item: any) => {
        const isMcq = Array.isArray(item.mcq) && item.mcq.length > 0;
        return {
          type: isMcq ? 'mcq' : 'text',
          _id: item._id,
          title: item.title,
          description: item.description || '',
          options: item.mcq || [],
        };
      }),
      {
        type: 'reflection',
        title:
          phase?.title ||
          localization.appkeys?.moduleExerciseReflectionTitle ||
          'Reflection',
        question:
          phase?.reflection ||
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
  }, [mcqList, phase, localization]);

  const currentStepData = useMemo(() => steps[currentStep] || {}, [steps, currentStep]);

  const selectedOptionId = useMemo(() => selectedOptions[currentStep], [selectedOptions, currentStep]);

  const isCompletingOrSavingAnswer = useMemo(() => isCompleting || isSavingAnswer, [isCompleting, isSavingAnswer]);

  const nextButtonStyles = useMemo(() => [
    styles.floatingNextButton,
    currentStepData?.type === 'reflection' && {
      position: 'relative' as const,
      marginTop: 20,
      marginBottom: 30,
      bottom: 0,
    },
  ], [styles.floatingNextButton, currentStepData?.type]);

  // Callbacks
  const handleSelectOption = useCallback((optionId: string) => {
    triggerHaptic('selection');
    setSelectedOptions(prev => ({
      ...prev,
      [currentStep]: optionId,
    }));
  }, [currentStep]);

  const handleNext = useCallback(() => {
    Keyboard.dismiss();
    setIsFocused(false);
    if (currentStep < steps.length - 1) {
      if (currentStepData.type === 'mcq') {
        const selectedOptionIdVal = selectedOptions[currentStep];
        if (!selectedOptionIdVal) {
          ToastService.show(
            localization.appkeys?.pleaseSelectOption ||
              'Please select an option to proceed',
          );
          return;
        }
      }
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
        mcqList.length > 0 ? mcqList[mcqList.length - 1]._id : '';
      completeLesson(
        {
          endpoint: endpoints.complete_lesson,
          data: {
            reflection: reflectionText,
            phase_id: phase?._id,
            exercise_id: lastExerciseId,
          },
        },
        {
          onSuccess: (data: any) => {
            if (!isMounted.current) return;
            queryClient.invalidateQueries({
              queryKey: ['phase_list'],
            });
            queryClient.invalidateQueries({
              queryKey: ['module_list'],
            });
            queryClient.invalidateQueries({
              queryKey: ['start_sub_module_list'],
            });
            queryClient.invalidateQueries({
              queryKey: ['start_sub_module_list_home'],
            });
            queryClient.invalidateQueries({
              queryKey: ['theme_list'],
            });
            dispatch(getUserDetail() as any);
            showPointsToast(
              `${localization.appkeys?.completedPhase || "You've completed"} ${
                phase?.phase ||
                `${localization.appkeys?.phase || 'Phase'} ${
                  phase?.phaseNumber || 1
                }`
              }`,
              `+${data?.data?.points || 0} ${(
                localization.appkeys?.pts || 'pts'
              ).toLowerCase()}`,
            );
            navigation.dispatch(state => {
              const targetRoute = isLastPhase
                ? AppRoutes.ModuleThemeDetail
                : AppRoutes.StartedModule;
              const idx = state.routes.findIndex(
                (r: any) => r.name === targetRoute,
              );
              if (idx !== -1) {
                return CommonActions.reset({
                  ...state,
                  routes: state.routes.slice(0, idx + 1),
                  index: idx,
                });
              }
              let actualTargetRoute = targetRoute;
              if (isLastPhase && (source === 'all' || source === 'dashboard')) {
                actualTargetRoute = AppRoutes.AllModules;
              }
              return CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: AppRoutes.BottomTab,
                    params: {
                      screen: AppRoutes.Modules,
                    },
                  },
                  {
                    name: actualTargetRoute,
                    params: {
                      type: 'started',
                    },
                  },
                ],
              });
            });
          },
          onError: () => {
            if (!isMounted.current) return;
            ToastService.show('Failed to complete lesson. Please try again.');
          },
        },
      );
    }
  }, [
    currentStep,
    steps,
    currentStepData,
    selectedOptions,
    reflectionText,
    mcqList,
    completeLesson,
    phase,
    localization,
    isLastPhase,
    source,
    navigation,
    queryClient,
    dispatch,
  ]);

  const handleBack = useCallback(() => {
    Keyboard.dismiss();
    setIsFocused(false);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  }, [currentStep, navigation]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Effects
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  if (isMcqLoading) {
    return <ExerciseLoading colors={colors} styles={styles} />;
  }

  return (
    <SolidView
      isScrollEnabled={currentStepData?.type === 'reflection'}
      view={
        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            {currentStepData.type !== 'reflection' ? (
              <ExerciseStepContent
                currentStep={currentStep}
                currentStepData={currentStepData}
                selectedOptionId={selectedOptionId}
                handleSelectOption={handleSelectOption}
                handleBack={handleBack}
                localization={localization}
                styles={styles}
              />
            ) : (
              <ExerciseReflection
                question={currentStepData.question}
                placeholder={currentStepData.placeholder}
                reflectionText={reflectionText}
                setReflectionText={setReflectionText}
                isFocused={isFocused}
                onFocus={handleFocus}
                onBlur={handleBlur}
                handleBack={handleBack}
                localization={localization}
                styles={styles}
              />
            )}
          </View>

          <SolidBtn
            titleTxt={
              currentStep === steps.length - 1
                ? localization.appkeys?.completed || 'Completed'
                : localization.appkeys?.next || 'Next'
            }
            onPress={handleNext}
            btnStyle={nextButtonStyles}
            isLoading={isCompletingOrSavingAnswer}
          />
        </View>
      }
    />
  );
};

export default ModuleExercise;
