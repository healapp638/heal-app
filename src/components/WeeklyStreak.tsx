import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import { LocalizationContext } from '../localization/localization';

import { useSelector } from 'react-redux';

const WeeklyStreak = () => {
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = useStyle(colors);
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
        day: weekdays[i],
        dateObject: dayDate,
        date: dayDate.getDate(),
      });
    }
    return weekDates;
  };

  const days = getWeekDates();
  const today = new Date();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {days.map((item, index) => {
          const isToday =
            item.dateObject.getFullYear() === today.getFullYear() &&
            item.dateObject.getMonth() === today.getMonth() &&
            item.dateObject.getDate() === today.getDate();

          const isCompletedInStreak = streakDays.some((timestamp: number) => {
            const streakDate = new Date(timestamp * 1000);
            return (
              streakDate.getFullYear() === item.dateObject.getFullYear() &&
              streakDate.getMonth() === item.dateObject.getMonth() &&
              streakDate.getDate() === item.dateObject.getDate()
            );
          });

          const isActive = isToday;
          const isCompleted = isCompletedInStreak && !isToday;

          return (
            <View key={index} style={styles.dayItem}>
              <SolidText style={[styles.dayText, { color: colors.brown }]}>
                {item.day}
              </SolidText>
              <View
                style={[
                  styles.dateBubble,
                  isActive && {
                    backgroundColor: colors.primary,
                    width: 40,
                    height: 40,
                    borderRadius: 25,
                  },
                  isCompleted && {
                    backgroundColor: colors.primary,
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                  },
                  !isActive &&
                    !isCompleted && {
                      backgroundColor: colors.bubbleGray,
                    },
                ]}
              >
                <SolidText
                  style={[
                    styles.dateText,
                    { color: isActive || isCompleted ? 'white' : colors.brown },
                    isActive && { fontSize: 14 },
                  ]}
                >
                  {item.date}
                </SolidText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const useStyle = (colors: any) =>
  StyleSheet.create({
    container: {
      marginVertical: 16,
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    dayItem: {
      alignItems: 'center',
      flex: 1,
    },
    dayText: {
      fontSize: 12,
      fontFamily: AppFonts.semiBold,
      marginBottom: 10,
      includeFontPadding: false,
    },
    dateBubble: {
      width: 30,
      height: 30,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.bubbleBorder,
    },
    dateText: {
      fontSize: 12,
      fontFamily: AppFonts.medium,
      includeFontPadding: false,
    },
  });

export default WeeklyStreak;
