import React, { useContext, useState } from 'react';
import { Platform, View } from 'react-native';
import SolidView from '../../components/SolidView';
import HomeHeader from '../../components/HomeHeader';
import { LocalizationContext } from '../../localization/localization';
import AppRoutes from '../../routes/RouteKeys/appRoutes';
import { useNavigation } from '@react-navigation/native';
import ProgressTrackerCard from '../../components/ProgressTrackerCard';
import DailyWeeklyToggle from '../../components/DailyWeeklyToggle';
import ChallengeList from '../../components/ChallengeList';

const Challenges = () => {
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  // Unified data array passed to the list component
  const allChallenges: any[] = [
    {
      id: '1',
      title: '5 minutes of meditation',
      description: 'Take a moment to breathe and center yourself',
      isCompleted: true,
      category: 'daily',
    },
    {
      id: '2',
      title: 'Moment of gratitude',
      description: 'Write 3 things you are grateful for today',
      points: '25 Pts',
      badge: '1 day',
      isCompleted: false,
      category: 'daily',
    },
    {
      id: '3',
      title: 'Letter to yourself',
      description: 'Write a compassionate letter to yourself as if to a friend',
      points: '25 Pts',
      badge: '1 day',
      isCompleted: false,
      category: 'daily',
    },
    {
      id: '4',
      title: 'Weekly Mindfulness session',
      description: 'Deep dive into your emotional well-being',
      points: '75 Pts',
      isCompleted: false,
      category: 'weekly',
    },
  ];

  return (
    <SolidView
      isScrollEnabled={true}
      view={
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: Platform.OS == 'ios' ? 4 : 10,
            paddingBottom: 140,
          }}
        >
          <HomeHeader
            showCrown
            showStreak={false}
            onCrownPress={() => {}}
            userName={
              localization.appkeys?.dailyChallenges || 'Daily Challenges'
            }
            safeSpaceLabel={
              localization.appkeys?.progressDayByDay || 'Safe Space'
            }
            streakCount={3}
            onStreakPress={() =>
              navigation.navigate(AppRoutes.DailyStreak as never)
            }
          />

          <ProgressTrackerCard
            viewStyle={{ marginTop: 20 }}
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

          <DailyWeeklyToggle
            activeTab={activeTab}
            onTabChange={setActiveTab}
            dailyLabel={localization.appkeys?.daily || 'Daily'}
            weeklyLabel={localization.appkeys?.weekly || 'Weekly'}
          />

          <ChallengeList activeTab={activeTab} data={allChallenges} />
        </View>
      }
    />
  );
};

export default Challenges;
