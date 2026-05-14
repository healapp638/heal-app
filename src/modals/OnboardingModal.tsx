import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { LocalizationContext } from '../localization/localization';
import SolidText from '../components/SolidText';
import SolidBtn from '../components/SolidBtn';
import HeaderProgress from '../components/HeaderProgress';
import { triggerHaptic } from '../hooks/useHaptic';
import usePostApi from '../hooks/usePostApi';
import { endpoints } from '../api/Services/endpoints';
import { useSelector, useDispatch } from 'react-redux';
import AppUtils from '../utils/appUtils';
import AppFonts from '../constants/fonts';
import { getUserDetail } from '../redux/Reducers/userData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
}

const OnboardingModal = ({
  visible,
  onClose,
  onBack,
}: OnboardingModalProps) => {
  const insets = useSafeAreaInsets();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const dispatch = useDispatch();
  const { mutate: completeOnboarding, isPending } = usePostApi();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    hearAboutUs: '',
    bringsYouHere: '',
    howFellingLately: '',
    likeToFellMore: '',
    timeYouCommit: '',
    startShowingOfYourSelf: '',
  });

  useEffect(() => {
    if (!visible) {
      setStep(0);
      setAnswers({
        hearAboutUs: '',
        bringsYouHere: '',
        howFellingLately: '',
        likeToFellMore: '',
        timeYouCommit: '',
        startShowingOfYourSelf: '',
      });
    }
  }, [visible]);

  const totalSteps = 6;

  const handleNext = () => {
    triggerHaptic('impactMedium');
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      submitAnswers();
    }
  };

  const handleBack = () => {
    triggerHaptic('impactMedium');
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const submitAnswers = () => {
    const payload = {
      ...answers,
      language: AppUtils.getLanguageCode(appLanguage),
    };

    completeOnboarding(
      {
        endpoint: endpoints.complete_onboarding,
        data: payload,
      },
      {
        onSuccess: () => {
          dispatch(getUserDetail() as any);
          onClose();
        },
        onError: error => {
          AppUtils.showToast(error?.message || 'Something went wrong');
        },
      },
    );
  };

  const updateAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const renderOption = (
    key: string,
    option: { id: string; label: string; icon?: any },
    isFullWidth = false,
  ) => {
    const isSelected = answers[key as keyof typeof answers] === option.label;
    const isOther = option.id === 'other';

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.optionCard,
          isFullWidth && styles.optionCardFull,
          isSelected && { borderColor: colors.brown },
          { backgroundColor: colors.white },
        ]}
        onPress={() => {
          triggerHaptic('impactMedium');
          updateAnswer(key, option.label);
        }}
        activeOpacity={0.7}
      >
        {!isFullWidth ? (
          <>
            <View style={styles.iconWrap}>
              {option.icon ? (
                <Image
                  source={option.icon}
                  style={
                    option?.id === 'group'
                      ? { height: 44, width: 44, marginLeft: -4 }
                      : styles.icon
                  }
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.iconPlaceholder} />
              )}
              {isSelected && (
                <Image
                  source={images.tick}
                  style={styles.tickIcon}
                  resizeMode="contain"
                />
              )}
            </View>
            <SolidText style={styles.optionText}>{option.label}</SolidText>
          </>
        ) : (
          <>
            <View style={styles.optionCardFullLeft}>
              {option.icon && (
                <Image
                  source={option.icon}
                  style={[styles.icon, { marginRight: 15 }]}
                  resizeMode="contain"
                />
              )}
              <SolidText style={styles.optionText}>{option.label}</SolidText>
            </View>
            {isSelected && (
              <Image
                source={images.tick}
                style={styles.tickIcon}
                resizeMode="contain"
              />
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.introBox}>
              <SolidText style={styles.introTitle}>
                {localization.appkeys?.welcomeHeader || 'Welcome!'}
              </SolidText>
              <SolidText style={styles.introSubtitle}>
                To personalize your safe space, please answer a few quick
                questions.
              </SolidText>
            </View>
            <SolidText style={styles.title}>
              {localization.appkeys?.hearAboutTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.seeBetterSubtitle}
            </SolidText>
            <View style={styles.optionsGrid}>
              {[
                {
                  id: 'tiktok',
                  label: localization.appkeys?.optionTikTok,
                  icon: images.tiktok,
                },
                {
                  id: 'insta',
                  label: localization.appkeys?.optionInsta,
                  icon: images.insta,
                },
                {
                  id: 'apple',
                  label: localization.appkeys?.optionAppStore,
                  icon: images.apple,
                },
                {
                  id: 'group',
                  label: localization.appkeys?.optionGroup,
                  icon: images.group,
                },
                {
                  id: 'fb',
                  label: localization.appkeys?.optionFB,
                  icon: images.fb,
                },
                {
                  id: 'youtube',
                  label: localization.appkeys?.optionYoutube,
                  icon: images.youtube,
                },
                {
                  id: 'twitter',
                  label: localization.appkeys?.optionTwitter,
                  icon: images.twitter,
                },
                {
                  id: 'google',
                  label: localization.appkeys?.optionGoogleS,
                  icon: images.google,
                },
                {
                  id: 'other',
                  label: localization.appkeys?.optionOther,
                  icon: images.other,
                },
              ].map(opt =>
                renderOption('hearAboutUs', opt, opt.id === 'other'),
              )}
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.bringYouTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.safeSpaceSub}
            </SolidText>
            <View style={styles.optionsList}>
              {[
                {
                  id: 'romantic',
                  label: localization.appkeys?.optionRomantic,
                  icon: images.romantic,
                },
                {
                  id: 'family',
                  label: localization.appkeys?.optionFamily,
                  icon: images.family,
                },
                {
                  id: 'friendship',
                  label: localization.appkeys?.optionFriendship,
                  icon: images.friendship,
                },
                {
                  id: 'loneliness',
                  label: localization.appkeys?.optionLoneliness,
                  icon: images.loneliness,
                },
                {
                  id: 'selfConfident',
                  label: localization.appkeys?.optionSelfConfident,
                  icon: images.selfconfident,
                },
                {
                  id: 'talk',
                  label: localization.appkeys?.optionNeedToTalk,
                  icon: images.needtotalk,
                },
              ].map(opt => renderOption('bringsYouHere', opt, true))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.feelingsTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.safeSpaceSub}
            </SolidText>
            <View style={styles.optionsList}>
              {[
                {
                  id: 'overwhelmed',
                  label: localization.appkeys?.optionOverwhelmed,
                },
                { id: 'drained', label: localization.appkeys?.optionDrained },
                {
                  id: 'overthinking',
                  label: localization.appkeys?.optionOverthinking,
                },
                { id: 'stuck', label: localization.appkeys?.optionStuck },
                { id: 'lost', label: localization.appkeys?.optionLost },
                { id: 'clarity', label: localization.appkeys?.optionClarity },
              ].map(opt => renderOption('howFellingLately', opt, true))}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.feelMoreTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.safeSpaceSub}
            </SolidText>
            <View style={styles.optionsList}>
              {[
                {
                  id: 'peace',
                  label: localization.appkeys?.optionPeaceOfMind,
                },
                {
                  id: 'confidence',
                  label: localization.appkeys?.optionConfidence,
                },
                {
                  id: 'strength',
                  label: localization.appkeys?.optionEmotionalStrength,
                },
                {
                  id: 'lifeClarity',
                  label: localization.appkeys?.optionLifeClarity,
                },
                { id: 'balance', label: localization.appkeys?.optionBalance },
                {
                  id: 'motivation',
                  label: localization.appkeys?.optionMotivation,
                },
              ].map(opt => renderOption('likeToFellMore', opt, true))}
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.timeCommitmentTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.timeCommitmentSub}
            </SolidText>
            <View style={styles.optionsList}>
              {[
                { id: '2min', label: localization.appkeys?.option2Min },
                { id: '5min', label: localization.appkeys?.option5Min },
                { id: '10min', label: localization.appkeys?.option10MinPlus },
                { id: 'needed', label: localization.appkeys?.optionWhenNeeded },
              ].map(opt => renderOption('timeYouCommit', opt, true))}
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.readyToStartTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.safeSpaceSub}
            </SolidText>
            <View style={styles.optionsList}>
              {[
                {
                  id: 'exploring',
                  label: localization.appkeys?.optionExploring,
                },
                { id: 'willing', label: localization.appkeys?.optionWilling },
                { id: 'ready', label: localization.appkeys?.optionReady },
              ].map(opt => renderOption('startShowingOfYourSelf', opt, true))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const isCurrentStepValid = () => {
    const keys = [
      'hearAboutUs',
      'bringsYouHere',
      'howFellingLately',
      'likeToFellMore',
      'timeYouCommit',
      'startShowingOfYourSelf',
    ];
    return !!answers[keys[step] as keyof typeof answers];
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={[
          styles.modalOverlay,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={styles.modalContent}>
          <HeaderProgress
            progress={(step + 1) / totalSteps}
            onBackPress={step > 0 ? handleBack : onBack}
            // showBack={step > 0}
          />
          <TouchableOpacity
            style={[styles.closeBtn, { top: insets.top + 10 }]}
            onPress={() => {
              triggerHaptic('impactMedium');
              onClose();
            }}
          >
            <Image
              source={images.close}
              style={styles.closeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="contain"
          /> */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderStep()}
          </ScrollView>
          <View style={styles.footer}>
            <SolidBtn
              titleTxt={localization.appkeys?.continue}
              disabled={!isCurrentStepValid() || isPending}
              isLoading={isPending}
              onPress={handleNext}
              btnStyle={styles.btn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '100%',
    width: '100%',
  },
  introBox: {
    backgroundColor: 'rgba(223, 157, 131, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(223, 157, 131, 0.2)',
  },
  introTitle: {
    fontSize: AppUtils.fontSize(18),
    fontFamily: AppFonts.reco,
    color: '#3A2110',
    marginBottom: 4,
  },
  introSubtitle: {
    fontSize: AppUtils.fontSize(13),
    color: '#3A2110',
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  heartRope: {
    width: '100%',
    height: 70,
    marginTop: -10,
    marginBottom: 10,
  },
  title: {
    fontSize: AppUtils.fontSize(22),
    color: '#3A2110',
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: AppUtils.fontSize(14),
    color: '#3A2110',
    marginBottom: 20,
    opacity: 0.7,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    width: '48.5%',
    height: 90,
    padding: 12,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  optionCardFull: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  optionCardFullLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  icon: {
    width: 32,
    height: 32,
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
  },
  tickIcon: {
    width: 24,
    height: 24,
  },
  optionText: {
    fontSize: AppUtils.fontSize(16),
    color: '#3A2110',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 10,
  },
  btn: {
    width: '100%',
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
    padding: 10,
  },
  closeIcon: {
    width: 14,
    height: 14,
    tintColor: '#3A2110',
  },
});

export default OnboardingModal;
