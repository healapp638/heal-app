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

  const [showNativeContent, setShowNativeContent] = React.useState(false);

  const handleResumeFlow = useCallback(() => {
    const currentScreen = onboarding?.currentScreen;
    if (!currentScreen) return;
    console.log('🚨 [WELCOME -> NATIVE] handleResumeFlow: Resuming old native onboarding flow to screen:', currentScreen);
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
    console.log('🔄 [WELCOME] handleStartOver: Clearing onboarding progress and starting over with Superwall');
    dispatch(clearOnboardingProgress());
    setResumeModalVisible(false);
    startSuperwallOnboarding(navigation, () => setShowNativeContent(true));
  }, [dispatch, navigation]);
  const hasInitializedSuperwall = useRef(false);

  useFocusEffect(
    useCallback(() => {
      console.log('🚀 [WELCOME -> SUPERWALL] Auto-launching Superwall onboarding placement on focus...');
      dispatch(clearOnboardingProgress());
      setResumeModalVisible(false);
      setShowNativeContent(false);
      startSuperwallOnboarding(navigation, () => {
        setShowNativeContent(true);
      });
    }, [navigation, dispatch]),
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
    <SolidView
      isScrollEnabled={showNativeContent}
      view={
        showNativeContent ? (
          <View style={styles.mainContainer}>
            <View style={styles.header}>
              <Image
                source={images.h}
                style={styles.logoH}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.languagePill}
                onPress={() => {
                  triggerHaptic('impactMedium');
                  navigation.navigate(AppRoutes.SelectLanguage as never);
                }}
              >
                <Image
                  source={flag}
                  style={styles.flagIcon}
                  resizeMode="contain"
                />
                <SolidText style={styles.langCode}>{code}</SolidText>
              </TouchableOpacity>
            </View>
            <Image
              source={images.phone}
              resizeMode="contain"
              style={styles.phoneImage}
            />
            <View style={{ flex: 1, justifyContent: 'center', minHeight: 60 }}>
              <SolidText style={styles.title}>
                {localization.appkeys?.healingStarts}
              </SolidText>
            </View>
            <SolidBtn
              titleTxt={localization.appkeys?.welcome}
              btnStyle={styles.btn}
              onPress={() => {
                console.log('🔘 [WELCOME] Primary button pressed: Launching Superwall onboarding...');
                dispatch(clearOnboardingProgress());
                startSuperwallOnboarding(navigation, () => setShowNativeContent(true));
              }}
            />
            <SolidText
              onPress={() => {
                triggerHaptic('impactMedium');
                setSignInModalVisible(true);
              }}
              style={styles.footerText}
            >
              {localization.appkeys?.alreadyAccount}{' '}
              <Text style={styles.signInText}>
                {localization.appkeys?.signIn}
              </Text>
            </SolidText>

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
        ) : (
          <View style={[styles.mainContainer, { backgroundColor: colors.background }]} />
        )
      }
    />
  );
};
export default Welcome;
