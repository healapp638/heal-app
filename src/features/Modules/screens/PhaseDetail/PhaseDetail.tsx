import React, { useEffect } from 'react';
import { View, ScrollView, BackHandler } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidBtn from '../../../../components/SolidBtn';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

const PhaseDetail = () => {
  const { colors } = useTheme() as any;
  const { localization } = React.useContext(LocalizationContext) as any;
  const styles = style(colors);
  const navigation = useNavigation();

  const steps = [1, 2, 3, 4, 5];
  const activeStep = 1;
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title={localization.appkeys?.details || 'Details'} />

          <SolidText style={[styles.title, { color: colors.brown }]}>
            {localization.appkeys?.phase1 || 'Phase 1'}
          </SolidText>
          <SolidText style={[styles.subtitle, { color: colors.brown }]}>
            {localization.appkeys?.phase1Title ||
              'Defining Friendship for Yourself'}
          </SolidText>

          {/* Progress Circles */}
          <View style={styles.progressRow}>
            {steps.map((step, index) => {
              const isActive = step === activeStep;
              const isNextToActive = step === activeStep + 1;
              return (
                <React.Fragment key={step}>
                  <View style={styles.circleContainer}>
                    <View
                      style={
                        isActive ? styles.circleActive : styles.circleInactive
                      }
                    >
                      <SolidText
                        style={
                          isActive
                            ? styles.circleTextActive
                            : styles.circleTextInactive
                        }
                      >
                        {step}
                      </SolidText>
                    </View>
                  </View>
                  {index < steps.length - 1 && (
                    <View
                      style={[styles.line, isActive && styles.lineActive]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* Main Content Card */}
          <View style={styles.cardContainer}>
            <SolidText style={styles.cardTitle}>
              {localization.appkeys?.aboutChallenge || 'About this Challenge'}
            </SolidText>
            <SolidText style={styles.cardText}>
              {localization.appkeys?.friendshipPreciousDesc ||
                'Friendship is one of the most precious bonds — and one of the least defined. We assume it, take it for granted, sometimes neglect it. But few people take the time to define what it truly means to them.'}
            </SolidText>

            {/* Inner Card */}
            <View style={styles.innerCard}>
              <SolidText style={styles.innerCardTitle}>
                {localization.appkeys?.dimensionsOfFriendship ||
                  'The Dimensions of Friendship'}
              </SolidText>
              <SolidText style={styles.innerCardText}>
                {localization.appkeys?.healthyFriendshipDesc ||
                  "A healthy friendship rests on several pillars: reciprocity, trust, presence in difficult moments, enjoyment of each other's company, and the freedom to be yourself without needing to justify it."}
              </SolidText>
            </View>
          </View>
          <View style={{ flex: 1 }} />
          <SolidBtn
            titleTxt={localization.appkeys?.start || 'Start'}
            btnStyle={styles.startButton}
            onPress={() =>
              navigation.navigate(AppRoutes.ModuleExercise as never)
            }
          />
        </View>
      }
    />
  );
};

export default PhaseDetail;
