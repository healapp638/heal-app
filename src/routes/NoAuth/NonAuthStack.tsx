import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocalizationContext } from '../../localization/localization';

import AppRoutes from '../RouteKeys/appRoutes';
import Offer from '../../features/premium/screens/Offer/Offer';
import Reminder from '../../features/premium/screens/Reminder/Reminder';
import Premium from '../../features/premium/screens/Premium/Premium';
import Terms from '../../features/common/screens/Terms/Terms';
import PrivacyPolicy from '../../features/common/screens/PrivacyPolicy/PrivacyPolicy';
import TabNavigator from '../TabNavigator/TabNavigator';
import DailyStreak from '../../features/Home/screens/DailyStreak/DailyStreak';
import DailyQuote from '../../features/Home/screens/DailyQuote/DailyQuote';
import ProgressTracker from '../../features/Home/screens/ProgressTracker/ProgressTracker';
import ThemeMixes from '../../features/Home/screens/ThemeMixes/ThemeMixes';
import ThemeSeeAll from '../../features/Home/screens/ThemeSeeAll/ThemeSeeAll';
import SavedDailyQuote from '../../features/Home/screens/SavedDailyQuote/SavedDailyQuote';

import HealyChat from '../../features/Home/screens/HealyChat/HealyChat';
import ChallengeDetail from '../../features/Challenges/screens/ChallengeDetail/ChallengeDetail';
import Exercise from '../../features/Challenges/screens/Exercise/Exercise';
import StartedModule from '../../features/Modules/screens/StartedModule/StartedModule';
import PhaseDetail from '../../features/Modules/screens/PhaseDetail/PhaseDetail';
import ModuleExercise from '../../features/Modules/screens/ModuleExercise/ModuleExercise';
import AllModules from '../../features/Modules/screens/AllModules/AllModules';

import ThemeDetail from '../../features/Home/screens/ThemeDetail/ThemeDetail';
import ModuleThemeDetail from '../../features/Modules/screens/ModuleThemeDetail/ModuleThemeDetail';
import AddJournal from '../../features/Journal/screens/AddJournal/AddJournal';
import Calendar from '../../features/Journal/screens/Calendar/Calendar';
import ConnectedEntries from '../../features/Journal/screens/ConnectedEntries/ConnectedEntries';
import EditProfile from '../../features/settings/screens/EditProfile/EditProfile';
import DeleteAccount from '../../features/settings/screens/DeleteAccount/DeleteAccount';
import SelectLanguage from '../../features/auth/screens/SelectLanguage/SelectLanguage';
import PrivacyAndSecurity from '../../features/settings/screens/PrivacyAndSecurity/PrivacyAndSecurity';
import ChangePassword from '../../features/settings/screens/ChangePassword/ChangePassword';
import HelpAndSupport from '../../features/settings/screens/HelpAndSupport/HelpAndSupport';
import AboutHeal from '../../features/settings/screens/AboutHeal/AboutHeal';
import EmergencyResources from '../../features/settings/screens/EmergencyResources/EmergencyResources';
import TopPointsToast from '../../components/TopPointsToast';
import useGetApi from '../../hooks/useGetApi';
import { endpoints } from '../../api/Services/endpoints';
import { useSelector } from 'react-redux';
import SuccessModal from '../../modals/SuccessModal';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();

export default function NonAuthStack() {
  const { localization } = useContext(LocalizationContext) as any;
  useGetApi(endpoints.getRandomQuestions, ['getRandomQuestions'], {});

  const user = useSelector((state: any) => state.userData.user);
  const [prevLevel, setPrevLevel] = React.useState<number | null>(null);
  const [prevEarnedPoints, setPrevEarnedPoints] = React.useState<number | null>(
    null,
  );
  const [showLevelModal, setShowLevelModal] = React.useState(false);
  const [completedLevelNum, setCompletedLevelNum] = React.useState<number>(1);

  React.useEffect(() => {
    if (user && typeof user.currentLevel === 'number') {
      if (prevLevel === null) {
        setPrevLevel(user.currentLevel);
      } else if (user.currentLevel > prevLevel) {
        // Level completion detected via level increment!
        setCompletedLevelNum(prevLevel);
        setShowLevelModal(true);
        setPrevLevel(user.currentLevel);
      }
    }
  }, [user?.currentLevel, prevLevel]);

  React.useEffect(() => {
    if (user && user.total_points > 0) {
      const earned = user.total_earned_points || 0;
      const total = user.total_points || 0;

      if (prevEarnedPoints !== null && earned !== prevEarnedPoints) {
        if (earned >= total) {
          // Level completion detected via points threshold!
          setCompletedLevelNum(user.currentLevel || 1);
          setShowLevelModal(true);
        }
      }
      setPrevEarnedPoints(earned);
    }
  }, [user?.total_earned_points, user?.total_points, prevEarnedPoints]);

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name={AppRoutes.Offer} component={Offer} />
        <Stack.Screen name={AppRoutes.Reminder} component={Reminder} />
        <Stack.Screen name={AppRoutes.Premium} component={Premium} />
        <Stack.Screen name={AppRoutes.Terms} component={Terms} />
        <Stack.Screen
          name={AppRoutes.PrivacyPolicy}
          component={PrivacyPolicy}
        />
        <Stack.Screen name={AppRoutes.BottomTab} component={TabNavigator} />
        <Stack.Screen name={AppRoutes.DailyStreak} component={DailyStreak} />
        <Stack.Screen name={AppRoutes.DailyQuote} component={DailyQuote} />
        <Stack.Screen
          name={AppRoutes.ProgressTracker}
          component={ProgressTracker}
        />
        <Stack.Screen name={AppRoutes.ThemeMixes} component={ThemeMixes} />
        <Stack.Screen name={AppRoutes.ThemeSeeAll} component={ThemeSeeAll} />
        <Stack.Screen name={AppRoutes.ThemeDetail} component={ThemeDetail} />
        <Stack.Screen
          name={AppRoutes.SavedDailyQuote}
          component={SavedDailyQuote}
        />
        <Stack.Screen name={AppRoutes.HealyChat} component={HealyChat} />
        <Stack.Screen
          name={AppRoutes.ChallengeDetail}
          component={ChallengeDetail}
        />
        <Stack.Screen name={AppRoutes.Exercise} component={Exercise} />
        <Stack.Screen
          name={AppRoutes.StartedModule}
          component={StartedModule}
        />
        <Stack.Screen name={AppRoutes.PhaseDetail} component={PhaseDetail} />
        <Stack.Screen
          name={AppRoutes.ModuleExercise}
          component={ModuleExercise}
        />
        <Stack.Screen
          name={AppRoutes.ModuleThemeDetail}
          component={ModuleThemeDetail}
        />
        <Stack.Screen name={AppRoutes.AllModules} component={AllModules} />
        <Stack.Screen name={AppRoutes.AddJournal} component={AddJournal} />
        <Stack.Screen name={AppRoutes.Calendar} component={Calendar} />
        <Stack.Screen
          name={AppRoutes.ConnectedEntries}
          component={ConnectedEntries}
        />
        <Stack.Screen name={AppRoutes.EditProfile} component={EditProfile} />
        <Stack.Screen
          name={AppRoutes.DeleteAccount}
          component={DeleteAccount}
        />
        <Stack.Screen
          name={AppRoutes.SelectLanguage}
          component={SelectLanguage}
        />
        <Stack.Screen
          name={AppRoutes.PrivacyAndSecurity}
          component={PrivacyAndSecurity}
        />
        <Stack.Screen
          name={AppRoutes.ChangePassword}
          component={ChangePassword}
        />
        <Stack.Screen
          name={AppRoutes.HelpAndSupport}
          component={HelpAndSupport}
        />
        <Stack.Screen name={AppRoutes.aboutHeal} component={AboutHeal} />
        <Stack.Screen
          name={AppRoutes.EmergencyResources}
          component={EmergencyResources}
        />
      </Stack.Navigator>
      <TopPointsToast />
      <SuccessModal
        visible={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        title={localization.appkeys?.wellDone || 'Well done'}
        subtitle={`${
          localization.appkeys?.completedPhase || "You've completed"
        } ${localization.appkeys?.level || 'Level'} ${completedLevelNum}`}
        btnLabel={localization.appkeys?.continue || 'Continue'}
        onPressBtn={() => setShowLevelModal(false)}
        btnStyle={{ marginTop: -10 }}
      />
    </>
  );
}
