import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import FastImage from '@d11/react-native-fast-image';
import Svg, { Text as SvgText } from 'react-native-svg';
import SolidText from '../components/SolidText';
import SolidBtn from '../components/SolidBtn';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { LocalizationContext } from '../localization/localization';
import { useSelector } from 'react-redux';

interface StreakModalProps {
  visible: boolean;
  onClose: () => void;
  streakCount?: number;
  mode?: 'claim' | 'view';
}

const OutlinedNumber = ({
  number,
  mode = 'view',
}: {
  number: number | string;
  mode?: 'claim' | 'view';
}) => {
  const { images } = useTheme() as any;
  const targetNumber =
    typeof number === 'number' ? number : parseInt(number, 10) || 0;

  const [displayNumber, setDisplayNumber] = useState(
    mode === 'view' ? targetNumber : targetNumber > 0 ? targetNumber - 1 : 0,
  );
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Scale and fade-in animation (0 to 1)
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    if (mode === 'view') {
      setDisplayNumber(targetNumber);
      return;
    }

    // 2. Smooth numeric count-up animation
    const startVal = targetNumber > 0 ? targetNumber - 1 : 0;
    let startTimestamp: number | null = null;
    const duration = 1000; // 1 second

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setDisplayNumber(
        startVal + Math.floor(progress * (targetNumber - startVal)),
      );
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [targetNumber, scaleAnim, mode]);

  return (
    <Animated.View
      style={[
        staticStyles.outlinedContainer,
        {
          opacity: scaleAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <FastImage
        source={images.fireGif}
        style={staticStyles.fireImage}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Svg
        height="260"
        width="260"
        viewBox="0 0 150 150"
        style={staticStyles.svgTextContainer}
      >
        <SvgText
          fill="rgba(255, 255, 255, 0.7)"
          stroke="#FF6B6B"
          strokeWidth="1"
          fontSize="80"
          fontWeight="bold"
          x="75"
          y="115"
          textAnchor="middle"
          fontFamily={AppFonts.medium}
        >
          {displayNumber}
        </SvgText>
      </Svg>
    </Animated.View>
  );
};

const StreakModal = ({
  visible,
  onClose,
  streakCount = 0,
  mode = 'view',
}: StreakModalProps) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = useStyles(colors);

  const user = useSelector((state: any) => state.userData?.user);
  const streakDays = user?.streak_days || [];

  // Get dates of the current week (Monday to Sunday)
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);

    const weekDates = [];
    const weekdays = [
      localization.appkeys?.dayMo || 'Mo',
      localization.appkeys?.dayTu || 'Tu',
      localization.appkeys?.dayWe || 'We',
      localization.appkeys?.dayTh || 'Th',
      localization.appkeys?.dayFr || 'Fr',
      localization.appkeys?.daySa || 'Sa',
      localization.appkeys?.daySu || 'Su',
    ];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      weekDates.push({
        label: weekdays[i],
        dateObject: dayDate,
      });
    }
    return weekDates;
  };

  const days = getWeekDates();

  const daysProgress = days.map(item => {
    const isCompleted = streakDays.some((timestamp: number) => {
      const streakDate = new Date(timestamp * 1000);
      return (
        streakDate.getFullYear() === item.dateObject.getFullYear() &&
        streakDate.getMonth() === item.dateObject.getMonth() &&
        streakDate.getDate() === item.dateObject.getDate()
      );
    });
    return {
      label: item.label,
      isCompleted,
    };
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.card} testID="streakmodal">
          {/* Centered Flame with Streak Overlay Number */}
          {visible && <OutlinedNumber number={streakCount} mode={mode} />}

          {/* Days Progress Row */}
          <View style={styles.daysRow}>
            {daysProgress.map((day, index) => (
              <View key={index} style={styles.dayItem}>
                <SolidText style={styles.dayLabel}>{day.label}</SolidText>
                {day.isCompleted ? (
                  <Image
                    source={images.tick}
                    style={styles.tickIcon}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={[styles.statusCircle, styles.inactiveCircle]} />
                )}
              </View>
            ))}
          </View>

          {/* Caption text */}
          <SolidText style={styles.caption}>
            {localization.appkeys?.buildStreak ||
              'Build a streak, one day at a time'}
          </SolidText>

          {/* Close button */}
          <SolidBtn
            titleTxt={localization.appkeys?.close || 'Close'}
            onPress={onClose}
            btnStyle={styles.btn}
          />
        </View>
      </View>
    </Modal>
  );
};

const useStyles = (colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: colors.background,
      borderRadius: 28,
      paddingHorizontal: 24,

      paddingBottom: 24,
      width: '100%',

      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
    daysRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
      marginTop: 40,
    },
    dayItem: {
      alignItems: 'center',
      flex: 1,
    },
    dayLabel: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(12),
      marginBottom: 8,
      textAlign: 'center',
      includeFontPadding: false,
      color: colors.brown,
    },
    statusCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inactiveCircle: {
      backgroundColor: '#F3F7FC',
      borderWidth: 1,
      borderColor: '#20202033',
    },
    tickIcon: {
      width: 30,
      height: 30,
    },
    caption: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.brown,
      textAlign: 'center',
      marginBottom: 24,
      includeFontPadding: false,
    },
    btn: {
      width: '100%',
      marginTop: 0,
      marginBottom: 0,
      alignSelf: 'center',
      height: Platform.OS === 'ios' ? 54 : 50,
      backgroundColor: colors.brown,
      borderRadius: 100,
    },
  });

const staticStyles = StyleSheet.create({
  outlinedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: '100%',
  },
  fireImage: {
    position: 'absolute',
    width: 220,
    height: 220,
    zIndex: 0,
  },
  svgTextContainer: {
    zIndex: 1,
    marginTop: 120,
  },
});

export default StreakModal;
