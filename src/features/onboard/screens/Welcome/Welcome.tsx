import {
  Alert,
  Image,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import React, { useCallback, useContext, useRef } from 'react';
import SolidView from '../../../../components/SolidView';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import { useHaptic } from '../../../../hooks/useHaptic';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import { useDispatch, useSelector } from 'react-redux';
import { clearOnboardingProgress } from '../../../../redux/Reducers/userData';
import {
  getResumeStackRoutes,
  RESUMABLE_ONBOARDING_ROUTES,
} from '../../utils/onboardingProgress';
import ResumeModal from '../../../../modals/ResumeModal';
import SignInModal from '../../../../modals/SignInModal';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { startSuperwallOnboarding } from '../../../../utils/superwallService';

const Welcome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { triggerHaptic } = useHaptic();
  const { images, colors } = useTheme() as any;
  const { appLanguage, localization } = useContext(LocalizationContext) as any;
  const onboarding = useSelector((state: any) => state.userData?.onboarding);
  const auth = useSelector((state: any) => state.userData?.auth);
  const hasPromptedOnFocus = useRef(false);
  const [resumeModalVisible, setResumeModalVisible] = React.useState(false);
  const [signInModalVisible, setSignInModalVisible] = React.useState(false);

  const handleResumeFlow = useCallback(() => {
    const currentScreen = onboarding?.currentScreen;
    if (!currentScreen) return;
    const stackRoutes = getResumeStackRoutes(currentScreen);
    if (!stackRoutes.length) return;
    setResumeModalVisible(false);
    setTimeout(() => {
      (navigation as any).reset({
        index: stackRoutes.length - 1,
        routes: stackRoutes.map(name => ({
          name,
        })),
      });
    }, 150);
  }, [navigation, onboarding?.currentScreen]);
  const handleStartOver = useCallback(() => {
    dispatch(clearOnboardingProgress());
    setResumeModalVisible(false);
  }, [dispatch]);
  useFocusEffect(
    useCallback(() => {
      hasPromptedOnFocus.current = false;
      // Only a genuinely resumable, in-progress *old-style* native onboarding
      // (past the trivial GetStarted/HearAboutUs screens) should show the
      // "resume?" prompt. Everything else -- fresh user, already-completed
      // onboarding, or barely-started onboarding -- goes straight to Superwall.
      const canResume =
        !auth &&
        !onboarding?.isCompleted &&
        onboarding?.hasStarted &&
        onboarding?.currentScreen !== AppRoutes.GetStarted &&
        onboarding?.currentScreen !== AppRoutes.HearAboutUs &&
        RESUMABLE_ONBOARDING_ROUTES.includes(onboarding?.currentScreen);

      if (hasPromptedOnFocus.current) {
        return () => {
          hasPromptedOnFocus.current = false;
        };
      }
      hasPromptedOnFocus.current = true;
      if (canResume) {
        setResumeModalVisible(true);
      } else {
        // Nothing to resume -- present Superwall's onboarding placement
        // immediately instead of waiting for a tap on the native "Welcome"
        // button. The native UI stays mounted underneath as a backdrop/
        // fallback (e.g. if Superwall fails to load) and Sign In stays reachable.
        dispatch(clearOnboardingProgress());
        startSuperwallOnboarding(navigation);
      }
      return () => {
        hasPromptedOnFocus.current = false;
      };
    }, [
      dispatch,
      navigation,
      onboarding?.currentScreen,
      onboarding?.isCompleted,
      onboarding?.hasStarted,
      auth,
    ]),
  );
  const getLangData = () => {
    switch (appLanguage) {
      case 'Spanish':
        return {
          flag: images.spain,
          code: 'ESP',
        };
      case 'French':
        return {
          flag: images.france,
          code: 'FRA',
        };
      case 'German':
        return {
          flag: images.germany,
          code: 'DEU',
        };
      case 'Russian':
        return {
          flag: images.russia,
          code: 'RUS',
        };
      case 'Portuguese':
        return {
          flag: images.portugal,
          code: 'POR',
        };
      case 'Italian':
        return {
          flag: images.italy,
          code: 'ITA',
        };
      default:
        return {
          flag: images.eng,
          code: 'ENG',
        };
    }
  };
  const { flag, code } = getLangData();
  const styles = style(colors);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ResumeModal
        visible={resumeModalVisible}
        onClose={() => setResumeModalVisible(false)}
        onConfirm={handleResumeFlow}
        onStartOver={handleStartOver}
      />
      <SignInModal
        visible={signInModalVisible}
        onClose={() => setSignInModalVisible(false)}
      />
    </View>
  );
};
export default Welcome;
