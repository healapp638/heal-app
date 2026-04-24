import React, { useContext, useState } from 'react';
import { View, Platform } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';

const Exercise = () => {
  const { colors } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      text:
        localization.appkeys?.exerciseStep1 ||
        'Find a quiet place where you feel comfortable',
    },
    {
      text:
        localization.appkeys?.exerciseStep4 ||
        'For each one, write why it is important to you.',
    },
    {
      text:
        localization.appkeys?.exerciseStep2 ||
        'Think about the positive moments of your day, even the smallest ones.',
    },
    {
      text:
        localization.appkeys?.exerciseStep3 ||
        'Write down 3 things you feel grateful for.',
    },
    {
      text:
        localization.appkeys?.exerciseStep4 ||
        'For each one, write why it is important to you.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: AppRoutes.BottomTab as never,
            params: { screen: AppRoutes.Challenges } as any,
          },
        ],
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.exercise || 'Exercise'}
            onBackPress={handleBack}
          />

          <View style={styles.contentContainer}>
            <SolidText style={styles.numberText}>{currentStep + 1}</SolidText>
            <SolidText style={styles.descriptionText}>
              {steps[currentStep].text}
            </SolidText>
          </View>

          <SolidBtn
            titleTxt={
              currentStep === steps.length - 1
                ? localization.appkeys?.markAsComplete || 'Mark as Complete'
                : localization.appkeys?.next || 'Next'
            }
            onPress={handleNext}
            btnStyle={styles.nextButton}
          />
        </View>
      }
    />
  );
};

export default Exercise;
