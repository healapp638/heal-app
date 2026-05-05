import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getFirstWeekday(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

interface CalendarGridProps {
  year: number;
  month: number;
  todayDay: number;
  isCurrentMonth: boolean;
  onDayPress?: (day: number) => void;
  markedDates?: { [date: string]: number };
  selectedDay?: number;
}

const CalendarGrid = ({
  year,
  month,
  todayDay,
  isCurrentMonth,
  onDayPress,
  markedDates = {},
  selectedDay,
}: CalendarGridProps) => {
  const { colors } = useTheme() as any;

  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);

  const weeks = useMemo(() => {
    const cells: (number | null)[] = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    const trailingBlankCount = (7 - (cells.length % 7)) % 7;
    const paddedCells = [...cells, ...Array(trailingBlankCount).fill(null)];
    return Array.from({ length: paddedCells.length / 7 }, (_, weekIndex) =>
      paddedCells.slice(weekIndex * 7, weekIndex * 7 + 7),
    );
  }, [firstWeekday, daysInMonth]);

  return (
    <View>
      {/* Weekday Headers */}
      <View style={styles.weekRow}>
        {WEEK_DAYS.map((d, i) => (
          <View key={i} style={styles.weekHeaderCell}>
            <SolidText
              style={[styles.weekDayLabel, { color: colors.calendarDayBrown }]}
            >
              {d}
            </SolidText>
          </View>
        ))}
      </View>

      {/* Day Grid */}
      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.weekCellsRow}>
            {week.map((day, dayIndex) => {
              if (!day) {
                return (
                  <View
                    key={`blank-${weekIndex}-${dayIndex}`}
                    style={styles.dayCell}
                  />
                );
              }

              const isToday = isCurrentMonth && day === todayDay;
              const isSelected = day === selectedDay;
              const dateString = `${year}-${String(month + 1).padStart(
                2,
                '0',
              )}-${String(day).padStart(2, '0')}`;
              const hasEntries = markedDates[dateString] > 0;

              return (
                <View key={`day-${day}`} style={styles.dayCell}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.dayTouchable}
                    onPress={() => onDayPress?.(day)}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        isSelected && {
                          backgroundColor: colors.calendarTodayBg,
                        },
                      ]}
                    >
                      <SolidText
                        style={[
                          styles.dayText,
                          { color: colors.calendarDayBrown },
                          isSelected && styles.dayTextToday,
                        ]}
                      >
                        {day}
                      </SolidText>
                      {hasEntries && (
                        <View
                          style={[
                            styles.dot,
                            {
                              backgroundColor: isSelected
                                ? 'white'
                                : colors.calendarDayBrown,
                            },
                          ]}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekHeaderCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  weekDayLabel: {
    fontFamily: AppFonts.semiBold,
    fontSize: AppUtils.fontSize(13),
    includeFontPadding: false,
  },
  grid: {
    width: '100%',
  },
  weekCellsRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 38,
    height: 43,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dayText: {
    fontFamily: AppFonts.regular,
    fontSize: AppUtils.fontSize(16),
    includeFontPadding: false,
  },
  dayTextToday: {
    color: 'white',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});

export default CalendarGrid;
