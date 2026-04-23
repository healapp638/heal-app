import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

const steps = [
  { text: 'Find a quiet place where you feel comfortable' },
  { text: 'For each one, write why it is important to you.' },
  {
    text: 'Think about the positive moments of your day, even the smallest ones.',
  },
  { text: 'Write down 3 things you feel grateful for.' },
  { text: 'For each one, write why it is important to you.' },
];

const Exercise = () => {
  const { colors } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);

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
          <HeaderCommon title="Exercise" onBackPress={handleBack} />

          <View style={styles.contentContainer}>
            <SolidText style={styles.numberText}>{currentStep + 1}</SolidText>
            <SolidText style={styles.descriptionText}>
              {steps[currentStep].text}
            </SolidText>
          </View>

          <SolidBtn
            titleTxt={
              currentStep === steps.length - 1 ? 'Mark as Complete' : 'Next'
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
