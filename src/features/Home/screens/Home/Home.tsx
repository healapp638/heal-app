import React, { useContext } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import { LocalizationContext } from '../../../../localization/localization';
import HomeHeader from '../../../../components/HomeHeader';
import WeeklyStreak from '../../../../components/WeeklyStreak';
import DailyQuoteCard from '../../../../components/DailyQuoteCard';
import ProgressTrackerCard from '../../../../components/ProgressTrackerCard';
import SectionHeader from '../../../../components/SectionHeader';
import ChallengeCard from '../../../../components/ChallengeCard';
import ModuleCard from '../../../../components/ModuleCard';
import style from './style';
import PremiumModal from '../../../../modals/PremiumModal';
import StreakModal from '../../../../modals/StreakModal';
import JournalCard from '../../../../components/JournalCard';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetail } from '../../../../redux/Reducers/userData';
import useGetApi from '../../../../hooks/useGetApi';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { setModuleSubModule } from '../../../../redux/Reducers/tempData';
import messaging from '@react-native-firebase/messaging';
const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const user = useSelector((state: any) => state.userData.user);

  const [showCreditsModal, setShowCreditsModal] = React.useState(false);
  const [showStreakModal, setShowStreakModal] = React.useState(false);
  const [streakModalMode, setStreakModalMode] = React.useState<
    'claim' | 'view'
  >('view');
  const [streakModalCount, setStreakModalCount] = React.useState(0);
  const { mutate: postApi } = usePostApi();

  const userName = user?.fullName || 'User';
  const { data: startedModulesData, refetch: refetchStarted } = useGetApi(
    endpoints.start_sub_module_list,
    ['start_sub_module_list_home'],
    {
      limit: 10,
    },
  );
  const {
    data: aiAffirmationData,
    refetch: refetchAffirmation,
    isLoading: isAILoading,
  } = useGetApi(endpoints.ai_affirmation, ['getAIAffirmation']);
  const { refetch: refetchRandomQuestions } = useGetApi(
    endpoints.getRandomQuestions,
    ['getRandomQuestions'],
    {},
  );

  React.useEffect(() => {
    refetchRandomQuestions();
  }, [refetchRandomQuestions]);

  React.useEffect(() => {
    if (user?._id) {
      messaging()
        .unsubscribeFromTopic(user._id)
        .then(() => {
          return messaging()
            .subscribeToTopic(user._id)
            .then(() => {
              // console.log(
              //   'FCM Subscription Status: Subscribed successfully to topic',
              //   user._id,
              // );
            });
        })
        .catch(error => {
          // console.log(
          //   'FCM Subscription Status: Failed to update topic subscription',
          //   error,
          // );
        });
    }
  }, [user?._id]);

  useFocusEffect(
    React.useCallback(() => {
      refetchRandomQuestions();
    }, [refetchRandomQuestions]),
  );

  const startedModules = startedModulesData?.data?.subModules || [];
  const aiAffirmation =
    aiAffirmationData?.data?.affirmation ||
    localization.appkeys?.homeDailyQuote ||
    '"If you don\'t throw yourself into something, you\'ll never know what you could have had."';
  useFocusEffect(
    React.useCallback(() => {
      postApi(
        {
          endpoint: endpoints.claimStreak,
          data: {},
        },
        {
          onSuccess: (res: any) => {
            console.log(res);
            if (!res?.data?.is_hit) {
              const apiCount =
                res?.data?.streak_count ??
                res?.data?.user?.streak_count ??
                res?.data?.data?.streak_count;

              let targetCount;
              if (typeof apiCount === 'number') {
                targetCount = apiCount;
              } else {
                const today = new Date();
                const streakDays = user?.streak_days || [];
                const isTodayClaimed = streakDays.some((timestamp: number) => {
                  const streakDate = new Date(timestamp * 1000);
                  return (
                    streakDate.getFullYear() === today.getFullYear() &&
                    streakDate.getMonth() === today.getMonth() &&
                    streakDate.getDate() === today.getDate()
                  );
                });
                const currentCount = user?.streak_count ?? 0;
                targetCount = isTodayClaimed ? currentCount : currentCount + 1;
              }

              setStreakModalMode('claim');
              setStreakModalCount(targetCount);
              setShowStreakModal(true);
            }
            dispatch(getUserDetail() as any);
          },
          onError: (error: any) => {
            console.log('claimStreak error', error);
          },
        },
      );
      dispatch(getUserDetail() as any);
      refetchStarted();
      refetchAffirmation();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [dispatch, refetchStarted, refetchAffirmation, postApi]),
  );
  // console.log(user?.streak_days);
  return (
    <SolidView
      isScrollEnabled={false}
      showChat
      view={
        <View style={styles.mainContainer}>
          <HomeHeader
            userName={userName}
            safeSpaceLabel={localization.appkeys?.homeSafeSpace || 'Safe Space'}
            streakCount={user?.streak_count}
            showCrown={false}
            onCrownPress={() => setShowCreditsModal(true)}
            onStreakPress={() => {
              setStreakModalMode('view');
              setStreakModalCount(user?.streak_count ?? 0);
              setShowStreakModal(true);
            }}
            onCalendarPress={() =>
              navigation.navigate(AppRoutes.Calendar as never)
            }
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
          >
            <WeeklyStreak />

            <ProgressTrackerCard
              onPress={() => {
                triggerHaptic('impactMedium');
                return navigation.navigate(AppRoutes.ProgressTracker as never);
              }}
              title={
                localization.appkeys?.homeProgressTracker || 'Progress Tracker'
              }
            />

            <DailyQuoteCard
              key={user?.homeTheme?._id || 'default'}
              onPress={() => {
                triggerHaptic('impactMedium');
                return navigation.navigate(AppRoutes.DailyQuote as never);
              }}
              title={localization.appkeys?.homeQuoteDay || 'Quote of the day'}
              quote={aiAffirmation}
              exploreLabel={
                localization.appkeys?.homeExploreMore || 'Tap to explore more'
              }
              isLoading={isAILoading}
            />

            <SectionHeader
              title={
                localization.appkeys?.homeWhatYouCanDo || 'What you can do'
              }
              actionLabel={localization.appkeys?.homeSeeAll || 'See All'}
              onActionPress={() => {
                navigation.navigate(AppRoutes.Challenges as never);
              }}
            />

            <ChallengeCard
              onPress={() => {
                triggerHaptic('impactMedium');
                navigation.navigate(AppRoutes.Challenges as never);
              }}
              title={
                localization.appkeys?.challengeCompletedTitle ||
                "Completed today's challenge"
              }
              duration={localization.appkeys?.challengeDuration || '1 MIN'}
            />
            {startedModules?.length > 0 ? (
              <>
                <SectionHeader
                  title={
                    localization.appkeys?.startedModule || 'Started Modules'
                  }
                  actionLabel={localization.appkeys?.seeAll || 'See All'}
                  onActionPress={() => {
                    navigation.navigate(
                      AppRoutes.AllModules as never,
                      {
                        type: 'started',
                      } as never,
                    );
                  }}
                  containerStyle={{
                    marginTop: 10,
                  }}
                />
                <FlatList
                  data={startedModules.slice(0, 2)}
                  numColumns={2}
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item._id}
                  style={{
                    marginTop: 10,
                  }}
                  renderItem={({ item, index }) => (
                    <ModuleCard
                      onPress={() => {
                        triggerHaptic('impactMedium');
                        dispatch(
                          setModuleSubModule({
                            ...item,
                            _id: item.sub_module_id,
                          }),
                        );
                        return navigation.navigate(
                          AppRoutes.StartedModule as never,
                        );
                      }}
                      background={
                        index === 0 ? images.moduleBack1 : images.moduleBack2
                      }
                      progress={`${item.completed_phase_count}/${item.total_phase_count}`}
                      title={item.title}
                      category={
                        item.theme_title ||
                        localization.appkeys?.moduleRelationshipBasics ||
                        'RELATIONSHIP BASICS'
                      }
                    />
                  )}
                />
              </>
            ) : (
              <>
                <SectionHeader
                  title={
                    localization.appkeys?.startedModule || 'Started Modules'
                  }
                  containerStyle={{
                    marginTop: 10,
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    triggerHaptic('impactMedium');
                    navigation.navigate(AppRoutes.Modules as never);
                  }}
                  style={styles.startModuleCardContainer}
                >
                  <ImageBackground
                    source={images.moduleBack1}
                    style={styles.startModuleBackgroundImage}
                    imageStyle={{
                      borderRadius: 14,
                    }}
                  >
                    <View style={styles.startModuleOverlay}>
                      <View style={styles.startModuleLeft}>
                        <Image
                          source={images.book}
                          style={styles.startModuleIcon}
                          resizeMode="contain"
                        />

                        <View style={styles.startModuleTextContainer}>
                          <SolidText style={styles.startModuleTitle}>
                            {localization.appkeys?.startNewModule ||
                              'Start a new module'}
                          </SolidText>
                          <SolidText style={styles.startModuleSubtitle}>
                            {localization.appkeys?.exploreVarietyGuided ||
                              'EXPLORE A VARIETY OF GUIDED PROGRAMS'}
                          </SolidText>
                        </View>
                      </View>
                      <Image
                        source={images.forward}
                        style={styles.startModuleForward}
                        resizeMode="contain"
                      />
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </>
            )}

            <SectionHeader
              title={localization.appkeys?.todayJournal || 'Today Journal'}
              onActionPress={() => {}}
              containerStyle={{
                marginTop: 20,
              }}
            />
            <JournalCard
              title={
                localization.appkeys?.writeFeeling ||
                "Write what you're feeling"
              }
              duration={localization.appkeys?.journalTitle || 'JOURNAL'}
              onPress={() => {
                triggerHaptic('impactMedium');
                navigation.navigate(AppRoutes.Journal as never);
              }}
            />
          </ScrollView>
          <PremiumModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
          <StreakModal
            visible={showStreakModal}
            onClose={() => setShowStreakModal(false)}
            streakCount={streakModalCount}
            mode={streakModalMode}
          />
        </View>
      }
    />
  );
};
export default Home;
