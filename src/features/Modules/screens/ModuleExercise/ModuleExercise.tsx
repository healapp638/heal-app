import React, { cloneElement, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  View,
  TextInput,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import useGetApi from '../../../../hooks/useGetApi';
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
import { useDispatch } from 'react-redux';
import { getUserDetail } from '../../../../redux/Reducers/userData';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import AppFonts from '../../../../constants/fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { showPointsToast } from '../../../../components/TopPointsToast';

const ModuleExercise = () => {
  const { colors } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const route = useRoute();
  const { phase, isLastPhase } = (route.params as any) || {};

  const { data: mcqData, isLoading: isMcqLoading } = useGetApi(
    endpoints.exercise_mcq_list,
    ['exercise_mcq_list', phase?._id],
    {
      phase_id: phase?._id,
    },
  );

  const mcqList = (mcqData as any)?.data?.mcqList || [];

  const steps = [
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

  const [currentStep, setCurrentStep] = useState(0);
  const [reflectionText, setReflectionText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string;
  }>({});

  const { mutate: completeLesson, isPending: isCompleting } = usePostApi();
  const { mutate: addMcqAnswer, isPending: isSavingAnswer } = usePostApi();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  const handleSelectOption = (optionId: string) => {
    triggerHaptic('selection');
    setSelectedOptions(prev => ({
      ...prev,
      [currentStep]: optionId,
    }));
  };

  const handleNext = () => {
    Keyboard.dismiss();
    setIsFocused(false);
    if (currentStep < steps.length - 1) {
      if (currentStepData.type === 'mcq') {
        const selectedOptionId = selectedOptions[currentStep];
        if (!selectedOptionId) {
          ToastService.show(
            localization.appkeys?.pleaseSelectOption ||
              'Please select an option to proceed',
          );
          return;
        }

        addMcqAnswer(
          {
            endpoint: endpoints.add_mcq_answer,
            data: {
              phase_id: phase?._id,
              mcq_id: selectedOptionId,
              mcq_exercise_id: currentStepData._id,
            },
          },
          {
            onSuccess: () => {
              setCurrentStep(currentStep + 1);
            },
            onError: () => {
              ToastService.show('Failed to save answer. Please try again.');
            },
          },
        );
      } else {
        setCurrentStep(currentStep + 1);
      }
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
            console.log(data);
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
              `+${data?.data?.points || 0} pts`,
            );
            navigation.dispatch(state => {
              const targetRoute = isLastPhase
                ? AppRoutes.ModuleThemeDetail
                : AppRoutes.StartedModule;
              const index = state.routes.findIndex(
                (r: any) => r.name === targetRoute,
              );
              if (index !== -1) {
                return CommonActions.reset({
                  ...state,
                  routes: state.routes.slice(0, index + 1),
                  index,
                });
              }
              const source = (route.params as any)?.source;
              const theme = (route.params as any)?.theme;
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
                      theme: theme,
                      subModule: (route.params as any)?.subModule,
                      type: 'started',
                    },
                  },
                ],
              });
            });
          },
          onError: error => {
            console.log(error);
            ToastService.show('Failed to complete lesson. Please try again.');
          },
        },
      );
    }
  };
  const handleBack = () => {
    Keyboard.dismiss();
    setIsFocused(false);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };
  const currentStepData = steps[currentStep];

  if (isMcqLoading) {
    return (
      <SolidView
        view={
          <View
            style={[
              styles.mainContainer,
              {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <ActivityIndicator size="large" color={colors.brown} />
          </View>
        }
      />
    );
  }

  return (
    <SolidView
      isScrollEnabled={currentStepData?.type === 'reflection'}
      view={
        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            {currentStepData.type !== 'reflection' ? (
              <ScrollView
                style={{ width: '100%', flex: 1 }}
                contentContainerStyle={[
                  styles.scrollContent,
                  (currentStepData.type === 'text' ||
                    currentStepData.type === 'mcq') && { paddingBottom: 120 },
                ]}
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
                  style={[
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
                  ]}
                >
                  {currentStepData.title}
                </SolidText>

                {/* Reading Text / MCQ options */}
                {currentStepData.type === 'text' ? (
                  <SolidText style={styles.exerciseDescription}>
                    {currentStepData.description}
                  </SolidText>
                ) : (
                  <View style={styles.optionList}>
                    {currentStepData.options.map((optionItem: any) => {
                      const isSelected =
                        selectedOptions[currentStep] === optionItem._id;
                      return (
                        <TouchableOpacity
                          key={optionItem._id}
                          activeOpacity={0.7}
                          style={[
                            styles.optionCard,
                            isSelected && styles.optionCardSelected,
                          ]}
                          onPress={() => handleSelectOption(optionItem._id)}
                        >
                          <SolidText
                            style={[
                              styles.optionText,
                              isSelected && styles.optionTextSelected,
                            ]}
                          >
                            {optionItem.option}
                          </SolidText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </ScrollView>
            ) : (
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
                      {currentStepData.question}
                    </SolidText>
                    {/* <SolidText style={styles.reflectionInstruction}>
                      {currentStepData.instruction}
                    </SolidText> */}
                    <TextInput
                      style={styles.textInput}
                      multiline
                      placeholder={isFocused ? '' : currentStepData.placeholder}
                      placeholderTextColor="grey"
                      value={reflectionText}
                      onChangeText={setReflectionText}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      maxFontSizeMultiplier={1.4}
                      textAlignVertical="top"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Button outside ScrollView (floating) for all screens */}
          <SolidBtn
            titleTxt={
              currentStep === steps.length - 1
                ? localization.appkeys?.completed || 'Completed'
                : localization.appkeys?.next || 'Next'
            }
            onPress={(...args: any) => {
              return (handleNext as any)(...args);
            }}
            btnStyle={[
              styles.floatingNextButton,
              currentStepData?.type === 'reflection' && {
                position: 'relative',
                marginTop: 20,
                marginBottom: 30,
                bottom: 0,
              },
            ]}
            isLoading={isCompleting || isSavingAnswer}
          />
        </View>
      }
    />
  );
};
export default ModuleExercise;
