import React, {
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Image, View, Animated, Platform } from 'react-native';
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
import FastImage from '@d11/react-native-fast-image';
import Svg, { Text as SvgText } from 'react-native-svg';
import AppFonts from '../../../../constants/fonts';

const OutlinedNumber = ({
  number,
  source,
}: {
  number: number | string;
  source?: any;
}) => {
  const { images } = useTheme() as any;
  const [displayNumber, setDisplayNumber] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const targetNumber =
    typeof number === 'number' ? number : parseInt(number, 10) || 0;

  useEffect(() => {
    // 1. Scale and fade-in animation (0 to 1)
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // 2. Smooth numeric count-up animation
    let startTimestamp: number | null = null;
    const duration = 1000; // 1 second

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setDisplayNumber(Math.floor(progress * targetNumber));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [targetNumber, scaleAnim]);

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        opacity: scaleAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <FastImage
        source={images.fireGif}
        style={{
          position: 'absolute',
          width: 240,
          height: 240,
          zIndex: 0,
          top: 20,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Svg
        height="300"
        width="300"
        viewBox="0 0 150 150"
        style={{ zIndex: 1, marginTop: 50 }}
      >
        <SvgText
          fill="rgba(255, 255, 255, 0.7)"
          stroke="#FF6B6B"
          strokeWidth="1"
          fontSize={Platform.OS == 'ios' ? '80' : '80'}
          fontWeight="bold"
          x="75"
          y="120"
          textAnchor="middle"
          fontFamily={AppFonts.medium}
        >
          {displayNumber}
        </SvgText>
      </Svg>
    </Animated.View>
  );
};

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

  const currentDayIndex = new Date().getDay();
  const targetIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

  const daysProgress = [
    { label: 'Mo', isActive: targetIndex === 0 },
    { label: 'Tu', isActive: targetIndex === 1 },
    { label: 'We', isActive: targetIndex === 2 },
    { label: 'Th', isActive: targetIndex === 3 },
    { label: 'Fr', isActive: targetIndex === 4 },
    { label: 'Sa', isActive: targetIndex === 5 },
    { label: 'Su', isActive: targetIndex === 6 },
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
            <OutlinedNumber number={1} />

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
                            color: day.isActive ? colors.primary : colors.brown,
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
                          style={[styles.statusCircle, styles.inactiveCircle]}
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
