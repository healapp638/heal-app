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
import JournalCard from '../../../../components/JournalCard';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetail } from '../../../../redux/Reducers/userData';
import { store } from '../../../../redux/Store/store';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const user = useSelector((state: any) => state.userData.user);
  const [showCreditsModal, setShowCreditsModal] = React.useState(false);

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
  const startedModules = startedModulesData?.data?.subModules || [];
  const aiAffirmation =
    aiAffirmationData?.data?.affirmation ||
    localization.appkeys?.homeDailyQuote ||
    '"If you don\'t throw yourself into something, you\'ll never know what you could have had."';
  useFocusEffect(
    React.useCallback(() => {
      dispatch(getUserDetail() as any);
      refetchStarted();
      refetchAffirmation();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [dispatch, refetchStarted]),
  );
  return (
    <SolidView
      isScrollEnabled={false}
      showChat
      view={
        <View style={styles.mainContainer}>
          <HomeHeader
            userName={userName}
            safeSpaceLabel={localization.appkeys?.homeSafeSpace || 'Safe Space'}
            streakCount={3}
            showCrown={false}
            onCrownPress={() => setShowCreditsModal(true)}
            onStreakPress={() =>
              navigation.navigate(AppRoutes.DailyStreak as never)
            }
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
                  title={localization.appkeys?.startedModule || 'Started Modules'}
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
                        return navigation.navigate(
                          AppRoutes.StartedModule as never,
                          {
                            module: item.module,
                            subModule: {
                              ...item,
                              _id: item.sub_module_id,
                            },
                          } as never,
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
                  title={localization.appkeys?.startedModule || 'Started Modules'}
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
                            {localization.appkeys?.startNewModule || 'Start a new module'}
                          </SolidText>
                          <SolidText style={styles.startModuleSubtitle}>
                            {localization.appkeys?.exploreVarietyGuided || 'EXPLORE A VARIETY OF GUIDED PROGRAMS'}
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
              onActionPress={() => { }}
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
        </View>
      }
    />
  );
};
export default Home;
