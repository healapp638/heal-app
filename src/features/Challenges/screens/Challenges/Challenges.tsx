import React, { useContext, useState } from 'react';
import { Platform, View, ScrollView } from 'react-native';
import SolidView from '../../../../components/SolidView';
import HomeHeader from '../../../../components/HomeHeader';
import { LocalizationContext } from '../../../../localization/localization';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
import ProgressTrackerCard from '../../../../components/ProgressTrackerCard';
import DailyWeeklyToggle from '../../../../components/DailyWeeklyToggle';
import ChallengeList from '../../../../components/ChallengeList';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import OnboardingModal from '../../../../modals/OnboardingModal';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { useSelector } from 'react-redux';
import PremiumModal from '../../../../modals/PremiumModal';
import AppFonts from '../../../../constants/fonts';
import AppUtils from '../../../../utils/appUtils';
import SolidText from '../../../../components/SolidText';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
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

  const { colors } = useTheme() as any;

  const {
    data: challengeResponse,
    isLoading,
    error,
    refetch,
  } = useGetApi(endpoints.challenge_list, ['challenge_list', activeTab], {
    challenge_type: activeTab,
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );
  const formatRemainingTime = (endDateUnix: number) => {
    const now = moment();
    const end = moment.unix(endDateUnix);
    const duration = moment.duration(end.diff(now));

    if (duration.asMilliseconds() <= 0) return 'Expired';

    const days = duration.asDays();
    if (days >= 1) {
      const roundedDays = Math.ceil(days);
      return `${roundedDays} day${roundedDays > 1 ? 's' : ''}`;
    }

    const hours = duration.asHours();
    if (hours >= 1) {
      const roundedHours = Math.ceil(hours);
      return `${roundedHours} hr${roundedHours > 1 ? 's' : ''}`;
    }

    const minutes = Math.ceil(duration.asMinutes());
    return `${minutes} min`;
  };

  // Unified data array passed to the list component
  const challengeData = challengeResponse && challengeResponse.data;
  const allChallenges = Array.isArray(challengeData)
    ? challengeData.map((item: any) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        points: `${item.points} Pts`,
        badge: formatRemainingTime(item.end_date_unix),
        isCompleted: item.isCompleted,
        category: item.challenge_type, // 'daily' or 'weekly'
      }))
    : [];
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

            {isLoading ? (
              <View
                style={{
                  marginTop: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                }}
              >
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    shadowColor: colors.brown,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 5,
                  }}
                >
                  <ActivityIndicator size="large" color={colors.brown} />
                </View>
                <SolidText
                  style={{
                    fontSize: AppUtils.fontSize(16),
                    fontFamily: AppFonts.medium,
                    color: colors.brown,
                    textAlign: 'center',
                    opacity: 0.8,
                  }}
                >
                  {localization.appkeys?.fetchingChallenges ||
                    'Preparing your daily journey...'}
                </SolidText>
              </View>
            ) : (
              <ChallengeList activeTab={activeTab} data={allChallenges} />
            )}
          </ScrollView>
          <PremiumModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
          <OnboardingModal
            visible={showOnboardingModal}
            onClose={() => {
              setShowOnboardingModal(false);
              refetch();
            }}
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
