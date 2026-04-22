import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppUtils from '../utils/appUtils';
import AppFonts from '../constants/fonts';

const WeeklyStreak = () => {
  const { colors } = useTheme() as any;
  const styles = useStyle(colors);
  const days = [
    { day: 'Mo', date: 13, status: 'none' },
    { day: 'Tu', date: 14, status: 'none' },
    { day: 'We', date: 15, status: 'completed' },
    { day: 'Th', date: 16, status: 'active' },
    { day: 'Fr', date: 17, status: 'none' },
    { day: 'Sa', date: 18, status: 'none' },
    { day: 'Su', date: 19, status: 'none' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {days.map((item, index) => {
          const isActive = item.status === 'active';
          const isCompleted = item.status === 'completed';

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
                  }, // semi-transparent
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
