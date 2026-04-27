import { Alert, Image, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useContext, useRef } from 'react';
import SolidView from '../../../../components/SolidView';

import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
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

const Welcome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { images, colors } = useTheme() as any;
  const { appLanguage, localization } = useContext(LocalizationContext) as any;
  const onboarding = useSelector((state: any) => state.userData?.onboarding);
  const hasPromptedOnFocus = useRef(false);
  const [resumeModalVisible, setResumeModalVisible] = React.useState(false);

  const handleResumeFlow = useCallback(() => {
    const currentScreen = onboarding?.currentScreen;
    if (!currentScreen) return;

    const stackRoutes = getResumeStackRoutes(currentScreen);
    if (!stackRoutes.length) return;

    setResumeModalVisible(false);
    (navigation as any).reset({
      index: stackRoutes.length - 1,
      routes: stackRoutes.map(name => ({ name })),
    });
  }, [navigation, onboarding?.currentScreen]);

  const handleStartOver = useCallback(() => {
    dispatch(clearOnboardingProgress());
    setResumeModalVisible(false);
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      hasPromptedOnFocus.current = false;

      if (onboarding?.isCompleted) {
        dispatch(clearOnboardingProgress());
        return () => {
          hasPromptedOnFocus.current = false;
        };
      }

      if (
        onboarding?.currentScreen === AppRoutes.GetStarted ||
        onboarding?.currentScreen === AppRoutes.HearAboutUs
      ) {
        return () => {
          hasPromptedOnFocus.current = false;
        };
      }

      const canResume =
        onboarding?.hasStarted &&
        !onboarding?.isCompleted &&
        RESUMABLE_ONBOARDING_ROUTES.includes(onboarding?.currentScreen);

      if (!canResume || hasPromptedOnFocus.current) {
        return () => {
          hasPromptedOnFocus.current = false;
        };
      }

      hasPromptedOnFocus.current = true;
      setResumeModalVisible(true);

      return () => {
        hasPromptedOnFocus.current = false;
      };
    }, [
      dispatch,
      onboarding?.currentScreen,
      onboarding?.isCompleted,
      onboarding?.hasStarted,
    ]),
  );

  const getLangData = () => {
    switch (appLanguage) {
      case 'Spanish':
        return { flag: images.spain, code: 'ESP' };
      case 'French':
        return { flag: images.france, code: 'FRA' };
      case 'German':
        return { flag: images.germany, code: 'DEU' };
      case 'Russian':
        return { flag: images.russia, code: 'RUS' };
      case 'Portuguese':
        return { flag: images.portugal, code: 'POR' };
      case 'Italian':
        return { flag: images.italy, code: 'ITA' };
      default:
        return { flag: images.eng, code: 'ENG' };
    }
  };

  const { flag, code } = getLangData();
  const styles = style(colors);

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <Image
              source={images.h}
              style={styles.logoH}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.languagePill}
              onPress={() =>
                navigation.navigate(AppRoutes.SelectLanguage as never)
              }
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
          <SolidText style={styles.title}>
            {localization.appkeys?.healingStarts}
          </SolidText>
          <SolidBtn
            titleTxt={localization.appkeys?.welcome}
            btnStyle={styles.btn}
            onPress={() => navigation.navigate(AppRoutes.GetStarted as never)}
          />
          <SolidText
            onPress={() => navigation.navigate(AppRoutes.AccessScreen as never)}
            style={styles.footerText}
          >
            {localization.appkeys?.alreadyAccount}{' '}
            <SolidText style={styles.signInText}>
              {localization.appkeys?.signIn}
            </SolidText>
          </SolidText>

          <ResumeModal
            visible={resumeModalVisible}
            onClose={() => setResumeModalVisible(false)}
            onConfirm={handleResumeFlow}
            onStartOver={handleStartOver}
          />
        </View>
      }
    />
  );
};

export default Welcome;
