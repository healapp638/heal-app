import React, { useContext, useCallback } from 'react';
import { Image, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderCommon from '../../../../components/HeaderCommon';
import { useHaptic } from '../../../../hooks/useHaptic';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import { useDispatch, useSelector } from 'react-redux';
import { setOnboardingCurrentScreen } from '../../../../redux/Reducers/userData';

const StreakGrounded = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { triggerHaptic } = useHaptic();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const startGoalSelection = useSelector(
    (state: any) => state.userData?.onboarding?.answers?.goalStartWith ?? null,
  );

  // Extract digits from selection (e.g. "3 Days" -> "3", "21 Days" -> "21"). Default to "3".
  const streakNumber = startGoalSelection
    ? startGoalSelection.replace(/\D/g, '') || '3'
    : '3';

  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.StreakGrounded));
    }, [dispatch]),
  );

  const handleBackPress = () => {
    const routes = (navigation as any)?.getState?.()?.routes || [];
    const previousRouteName =
      routes.length > 1 ? routes[routes.length - 2]?.name : null;
    if (previousRouteName === AppRoutes.StartGoal) {
      navigation.goBack();
      return;
    }
    navigation.navigate(AppRoutes.StartGoal as never);
  };

  const handleContinuePress = () => {
    triggerHaptic('impactMedium');
    navigation.navigate(AppRoutes.PrivacyMatters as never);
  };

  const daysProgress = [
    { label: 'Mo', isActive: false },
    { label: 'Tu', isActive: false },
    { label: 'We', isActive: false },
    { label: 'Th', isActive: true },
    { label: 'Fr', isActive: true },
    { label: 'Sa', isActive: true },
    { label: 'Su', isActive: false },
  ];

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{
        flex: 1,
      }}
      view={
        <View style={styles.container}>
          <View style={styles.headerWrapper}>
            <HeaderCommon
              title={localization.appkeys?.streak || 'Streak'}
              onBackPress={handleBackPress}
            />
          </View>

          <View style={styles.mainContainer}>
            {/* Centered Flame with Streak Overlay Number */}
            <View style={styles.flameContainer}>
              <Image
                source={images.bigStreak}
                style={styles.bigStreak}
                resizeMode="contain"
              />
            </View>

            {/* Localized Titles & Descriptions */}
            <SolidText style={styles.title}>
              {localization.appkeys?.streakGroundedTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.streakGroundedSub}
            </SolidText>

            {/* Custom High-Fidelity Weekly Calendar Card */}
            <View style={styles.streakCard}>
              <View style={styles.daysRow}>
                {daysProgress.map((day, index) => {
                  return (
                    <View key={index} style={styles.dayItem}>
                      <SolidText
                        style={[
                          styles.dayLabel,
                          {
                            color: day.isActive
                              ? colors.primary
                              : colors.brown,
                          },
                        ]}
                      >
                        {day.label}
                      </SolidText>
                      {day.isActive ? (
                        <Image
                          source={images.tick}
                          style={styles.tickIcon}
                          resizeMode="contain"
                        />
                      ) : (
                        <View
                          style={[
                            styles.statusCircle,
                            styles.inactiveCircle,
                          ]}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
              <SolidText style={styles.cardCaption}>
                {localization.appkeys?.buildStreak}
              </SolidText>
            </View>

            <View style={{ flex: 1 }} />

            {/* Cocoa Brown Continue Button */}
            <SolidBtn
              titleTxt={localization.appkeys?.continue}
              btnStyle={styles.btn}
              onPress={handleContinuePress}
            />
          </View>
        </View>
      }
    />
  );
};

export default StreakGrounded;
