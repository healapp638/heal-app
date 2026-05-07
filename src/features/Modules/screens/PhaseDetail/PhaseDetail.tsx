import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, BackHandler, ActivityIndicator } from 'react-native';
import {
  useNavigation,
  useTheme,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidBtn from '../../../../components/SolidBtn';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import usePostApi from '../../../../hooks/usePostApi';

const PhaseDetail = () => {
  const { colors } = useTheme() as any;
  const { localization } = React.useContext(LocalizationContext) as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const route = useRoute();
  const { phase, isLastPhase } = route.params as any;

  const {
    data,
    isLoading: isDetailLoading,
    refetch: refetchDetail,
  } = useGetApi(
    endpoints.exercise_detail_list,
    ['exercise_detail', phase?._id],
    { phase_id: phase?._id, limit: 1 },
  );

  const lesson = data?.data?.lesson;
  const phaseDetail = data?.data?.phase;

  const {
    data: exerciseListData,
    isLoading: isListLoading,
    refetch: refetchList,
  } = useGetApi(endpoints.exercise_list, ['exercise_list', lesson?._id], {
    exercise_detail_id: lesson?._id,
  });
  const { mutate: startLesson, isPending: isStarting } = usePostApi();

  useFocusEffect(
    useCallback(() => {
      refetchDetail();
      if (lesson?._id) {
        refetchList();
      }
    }, [refetchDetail, refetchList, lesson?._id]),
  );

  const exercises = exerciseListData?.data?.exercises || [];
  const totalStepsCount = exercises.length + 2;
  const steps = Array.from({ length: totalStepsCount }, (_, i) => i + 1);
  const activeStep = 1;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  if (isDetailLoading || (lesson?._id && isListLoading)) {
    return (
      <SolidView
        view={
          <View
            style={[
              styles.mainContainer,
              { justifyContent: 'center', alignItems: 'center' },
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
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title={localization.appkeys?.details || 'Details'} />

          <SolidText style={[styles.title, { color: colors.brown }]}>
            {phase?.phase || localization.appkeys?.phase1 || 'Phase 1'}
          </SolidText>
          <SolidText style={[styles.subtitle, { color: colors.brown }]}>
            {phaseDetail?.title ||
              phase?.title ||
              localization.appkeys?.phase1Title ||
              'Defining Friendship for Yourself'}
          </SolidText>

          {/* Progress Circles */}
          <View style={styles.progressRow}>
            {steps.map((step, index) => {
              const isActive = step === activeStep;
              return (
                <React.Fragment key={step}>
                  <View style={styles.circleContainer}>
                    <View
                      style={
                        isActive ? styles.circleActive : styles.circleInactive
                      }
                    >
                      <SolidText
                        style={
                          isActive
                            ? styles.circleTextActive
                            : styles.circleTextInactive
                        }
                      >
                        {step}
                      </SolidText>
                    </View>
                  </View>
                  {index < steps.length - 1 && (
                    <View
                      style={[styles.line, isActive && styles.lineActive]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* Main Content Card */}
          <View style={styles.cardContainer}>
            <SolidText style={styles.cardTitle}>
              {lesson?.concept_title ||
                localization.appkeys?.aboutChallenge ||
                'About this Challenge'}
            </SolidText>
            <SolidText style={styles.cardText}>
              {lesson?.concept_description ||
                localization.appkeys?.friendshipPreciousDesc ||
                'Friendship is one of the most precious bonds.'}
            </SolidText>

            {/* Inner Card */}
            <View style={styles.innerCard}>
              <SolidText style={styles.innerCardTitle}>
                {lesson?.reading_title ||
                  localization.appkeys?.dimensionsOfFriendship ||
                  'The Dimensions of Friendship'}
              </SolidText>
              <SolidText style={styles.innerCardText}>
                {lesson?.reading_description ||
                  localization.appkeys?.healthyFriendshipDesc ||
                  'A healthy friendship rests on several pillars.'}
              </SolidText>
            </View>
          </View>
          <View style={{ flex: 1 }} />
          <SolidBtn
            titleTxt={localization.appkeys?.start || 'Start'}
            btnStyle={styles.startButton}
            onPress={() => {
              startLesson(
                {
                  endpoint: endpoints.start_lesson,
                  data: { phase_id: phase?._id },
                },
                {
                  onSuccess: () => {
                    navigation.navigate(
                      AppRoutes.ModuleExercise as never,
                      {
                        lesson,
                        phase: { ...phase, ...phaseDetail },
                        exercises,
                        isLastPhase,
                        theme: (route.params as any)?.theme,
                        subModule: (route.params as any)?.subModule,
                        source: (route.params as any)?.source,
                      } as never,
                    );
                  },
                },
              );
            }}
            isLoading={isStarting}
          />
        </View>
      }
    />
  );
};

export default PhaseDetail;
