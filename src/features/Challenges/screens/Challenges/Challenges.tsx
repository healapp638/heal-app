import React, { useContext, useState } from 'react';
import { Platform, View, ScrollView } from 'react-native';
import SolidView from '../../../../components/SolidView';
import HomeHeader from '../../../../components/HomeHeader';
import { LocalizationContext } from '../../../../localization/localization';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { useNavigation } from '@react-navigation/native';
import ProgressTrackerCard from '../../../../components/ProgressTrackerCard';
import DailyWeeklyToggle from '../../../../components/DailyWeeklyToggle';
import ChallengeList from '../../../../components/ChallengeList';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import OnboardingModal from '../../../../modals/OnboardingModal';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { useSelector } from 'react-redux';
import PremiumModal from '../../../../modals/PremiumModal';
const Challenges = () => {
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const user = useSelector((state: any) => state.userData.user);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  React.useEffect(() => {
    if (user && user.isOnBoardingComplete === false) {
      setShowOnboardingModal(true);
    }
  }, [user]);

  // Unified data array passed to the list component
  const allChallenges: any[] = [
    {
      id: '1',
      title: localization.appkeys?.challenge1Title || '5 minutes of meditation',
      description:
        localization.appkeys?.challenge1Desc ||
        'Take a moment to breathe and center yourself',
      isCompleted: true,
      category: 'daily',
    },
    {
      id: '2',
      title: localization.appkeys?.challenge2Title || 'Moment of gratitude',
      description:
        localization.appkeys?.challenge2Desc ||
        'Write 3 things you are grateful for today',
      points: '25 Pts',
      badge: '1 day',
      isCompleted: false,
      category: 'daily',
    },
    {
      id: '3',
      title: localization.appkeys?.challenge3Title || 'Letter to yourself',
      description:
        localization.appkeys?.challenge3Desc ||
        'Write a compassionate letter to yourself as if to a friend',
      points: '25 Pts',
      badge: '1 day',
      isCompleted: false,
      category: 'daily',
    },
    {
      id: '4',
      title:
        localization.appkeys?.challenge4Title || 'Weekly Mindfulness session',
      description:
        localization.appkeys?.challenge4Desc ||
        'Deep dive into your emotional well-being',
      points: '75 Pts',
      isCompleted: false,
      category: 'weekly',
      badge: '3 day',
    },
    {
      id: '4',
      title:
        localization.appkeys?.challenge4Title || 'Weekly Mindfulness session',
      description:
        localization.appkeys?.challenge4Desc ||
        'Deep dive into your emotional well-being',
      points: '75 Pts',
      isCompleted: false,
      category: 'weekly',
      badge: '3 day',
    },
    {
      id: '4',
      title:
        localization.appkeys?.challenge4Title || 'Weekly Mindfulness session',
      description:
        localization.appkeys?.challenge4Desc ||
        'Deep dive into your emotional well-being',
      points: '75 Pts',
      isCompleted: false,
      category: 'weekly',
      badge: '3 day',
    },
  ];
  return (
    <SolidView
      isScrollEnabled={false}
      view={
        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: Platform.OS == 'ios' ? 4 : 10,
            }}
          >
            <HomeHeader
              showCrown
              showStreak={false}
              onCrownPress={() => {
                setShowCreditsModal(true);
              }}
              userName={
                localization.appkeys?.dailyChallenges || 'Daily Challenges'
              }
              safeSpaceLabel={
                localization.appkeys?.progressDayByDay || 'Safe Space'
              }
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 150,
            }}
          >
            <ProgressTrackerCard
              viewStyle={{
                marginTop: 20,
              }}
              onPress={() => {
                return navigation.navigate(AppRoutes.ProgressTracker as never);
              }}
              title={
                localization.appkeys?.homeProgressTracker || 'Progress Tracker'
              }
              percentage="30%"
              level={
                localization.appkeys?.homeLevel2?.split(' ')[1] || 'Level 2'
              }
              points="145/500 PTS"
            />

            <DailyWeeklyToggle
              activeTab={activeTab}
              onTabChange={setActiveTab}
              dailyLabel={localization.appkeys?.daily || 'Daily'}
              weeklyLabel={localization.appkeys?.weekly || 'Weekly'}
            />

            <ChallengeList activeTab={activeTab} data={allChallenges} />
          </ScrollView>
          <PremiumModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
          <OnboardingModal
            visible={showOnboardingModal}
            onClose={() => setShowOnboardingModal(false)}
            onBack={() => {
              setShowOnboardingModal(false);
              navigation.navigate(AppRoutes.Home as never);
            }}
          />
        </View>
      }
    />
  );
};
export default Challenges;
