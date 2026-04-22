import React, { useContext } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
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
import Journal from '../../../Journal/Journal';
import JournalCard from '../../../../components/JournalCard';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

const Home = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const modulesData = [
    {
      id: '1',
      background: images.moduleBack1,
      progress: '2/7',
      title: 'Red Flags I Ignored',
      category: 'RELATIONSHIP BASICS',
    },
    {
      id: '2',
      background: images.moduleBack2,
      progress: '1/5',
      title: 'The Unfinished Conversations',
      category: 'CLOSURE & HEALING',
    },
  ];

  return (
    <SolidView
      isScrollEnabled
      showChat
      view={
        <View style={styles.mainContainer}>
          <HomeHeader
            userName="John Doe"
            safeSpaceLabel={localization.appkeys?.homeSafeSpace || 'Safe Space'}
            streakCount={3}
            onStreakPress={() =>
              navigation.navigate(AppRoutes.DailyStreak as never)
            }
          />

          <WeeklyStreak />

          <ProgressTrackerCard
            onPress={() =>
              navigation.navigate(AppRoutes.ProgressTracker as never)
            }
            title={
              localization.appkeys?.homeProgressTracker || 'Progress Tracker'
            }
            percentage="30%"
            level={localization.appkeys?.homeLevel2?.split(' ')[1] || 'Level 2'}
            points="145/500 PTS"
          />

          <DailyQuoteCard
            onPress={() => navigation.navigate(AppRoutes.DailyQuote as never)}
            title={localization.appkeys?.homeQuoteDay || 'Quote of the day'}
            quote={
              localization.appkeys?.homeDailyQuote ||
              '"If you don\'t throw yourself into something, you\'ll never know what you could have had."'
            }
            exploreLabel={
              localization.appkeys?.homeExploreMore || 'Tap to explore more'
            }
          />

          <SectionHeader
            title={localization.appkeys?.homeWhatYouCanDo || 'What you can do'}
            actionLabel={localization.appkeys?.homeSeeAll || 'See All'}
            onActionPress={() => {}}
          />

          <ChallengeCard
            title={
              localization.appkeys?.challengeCompletedTitle ||
              "Completed today's challenge"
            }
            duration={localization.appkeys?.challengeDuration || '1 MIN'}
          />

          <SectionHeader
            title={localization.appkeys?.startedModule || 'Started Modules'}
            actionLabel={localization.appkeys?.continue || 'Continue'}
            onActionPress={() => {}}
            containerStyle={{ marginTop: 10 }}
          />

          <FlatList
            data={modulesData}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            style={{ marginTop: 10 }}
            renderItem={({ item }) => (
              <ModuleCard
                background={item.background}
                progress={item.progress}
                title={item.title}
                category={item.category}
              />
            )}
          />

          <SectionHeader
            title={localization.appkeys?.todayJournal || 'Today Journal'}
            onActionPress={() => {}}
            containerStyle={{ marginTop: 20 }}
          />
          <JournalCard
            title={
              localization.appkeys?.writeFeeling || "Write what you're feeling"
            }
            duration={localization.appkeys?.journalTitle || 'JOURNAL'}
          />
        </View>
      }
    />
  );
};

export default Home;
