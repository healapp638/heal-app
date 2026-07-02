import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { View, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';

import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import useGetApi from '../../../../hooks/useGetApi';
import { showPointsToast } from '../../../../components/TopPointsToast';
import { useDispatch } from 'react-redux';
import { getUserDetail } from '../../../../redux/Reducers/userData';
import { setChallengeJustCompleted } from '../../../../redux/Reducers/tempData';
import StepItem from '../../../../components/StepItem';

const Exercise = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme() as any;
  const styles = style(colors);
  const { width } = Dimensions.get('window');
  const itemWidth = width - 40; // paddingHorizontal: 20 on mainContainer
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const route = useRoute() as any;
  const {
    exercises: routeExercises,
    challenge_id,
    challenge_type,
  } = route.params || {};
  const { mutate: completeChallengeApi, isPending: isCompleting } =
    usePostApi();
  const queryClient = useQueryClient();

  const { data: detailResponse, isLoading } = useGetApi(
    endpoints.challenge_details,
    ['challenge_details', challenge_id],
    {
      challenge_id,
      challenge_type,
    },
  );

  const challengeData = detailResponse?.data?.[0] || {};
  const exercises = routeExercises || challengeData.exercises;

  const { localization } = useContext(LocalizationContext) as any;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: currentStep,
        animated: true,
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const renderStep = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <StepItem
          item={item}
          index={index}
          styles={styles}
          itemWidth={itemWidth}
        />
      );
    },
    [styles, itemWidth],
  );

  if (isLoading) {
    return (
      <SolidView
        view={
          <View style={styles.mainContainer}>
            <HeaderCommon
              title={localization.appkeys?.exercise || 'Exercise'}
              onBackPress={() => navigation.goBack()}
            />
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brown} />
            </View>
          </View>
        }
      />
    );
  }
  const steps =
    exercises?.length > 0
      ? exercises?.map((item: any) => ({
          text: item.title,
        }))
      : [
          {
            text:
              localization.appkeys?.exerciseStep1 ||
              'Find a quiet place where you feel comfortable',
          },
          {
            text:
              localization.appkeys?.exerciseStep4 ||
              'For each one, write why it is important to you.',
          },
          {
            text:
              localization.appkeys?.exerciseStep2 ||
              'Think about the positive moments of your day, even the smallest ones.',
          },
          {
            text:
              localization.appkeys?.exerciseStep3 ||
              'Write down 3 things you feel grateful for.',
          },
          {
            text:
              localization.appkeys?.exerciseStep4 ||
              'For each one, write why it is important to you.',
          },
        ];
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeChallengeApi(
        {
          endpoint: endpoints.complete_challenges,
          data: {
            challenge_id,
            challenge_type,
          },
        },
        {
          onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['challenge_list'] });
            dispatch(setChallengeJustCompleted(true));
            showPointsToast(
              data?.message,
              `+${data?.data?.points} ${(
                localization.appkeys?.pts || 'pts'
              ).toLowerCase()}`,
            );
            dispatch(getUserDetail() as any);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: AppRoutes.BottomTab as never,
                  params: {
                    screen: AppRoutes.Challenges,
                  } as any,
                },
              ],
            });
          },
          onError: () => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: AppRoutes.BottomTab as never,
                  params: {
                    screen: AppRoutes.Challenges,
                  } as any,
                },
              ],
            });
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
  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.exercise || 'Exercise'}
            onBackPress={handleBack}
          />

          <FlatList
            ref={flatListRef}
            data={steps}
            renderItem={renderStep}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            getItemLayout={(_, index) => ({
              length: itemWidth,
              offset: itemWidth * index,
              index,
            })}
          />

          <SolidBtn
            titleTxt={
              currentStep === steps.length - 1
                ? localization.appkeys?.markAsComplete || 'Mark as Complete'
                : localization.appkeys?.next || 'Next'
            }
            onPress={(...args: any) => {
              return (handleNext as any)(...args);
            }}
            btnStyle={styles.nextButton}
            isLoading={isCompleting}
          />
        </View>
      }
    />
  );
};
export default Exercise;
