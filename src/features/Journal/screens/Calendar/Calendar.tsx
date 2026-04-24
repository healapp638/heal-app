import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import HomeHeader from '../../../../components/HomeHeader';
import CalendarGrid from '../../../../components/CalendarGrid';
import ConnectedPill from '../../../../components/ConnectedPill';
import { LocalizationContext } from '../../../../localization/localization';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';
import GetCreditsModal from '../../../../modals/GetCreditsModal';

const Calendar = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const MONTHS = [
    localization.appkeys?.monthJan || 'January',
    localization.appkeys?.monthFeb || 'February',
    localization.appkeys?.monthMar || 'March',
    localization.appkeys?.monthApr || 'April',
    localization.appkeys?.monthMay || 'May',
    localization.appkeys?.monthJun || 'June',
    localization.appkeys?.monthJul || 'July',
    localization.appkeys?.monthAug || 'August',
    localization.appkeys?.monthSep || 'September',
    localization.appkeys?.monthOct || 'October',
    localization.appkeys?.monthNov || 'November',
    localization.appkeys?.monthDec || 'December',
  ];

  const styles = style(colors);
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);
  const isCurrentMonth = year === todayYear && month === todayMonth;

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  }

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.calendarTitle || 'Calendar'}
            rightIcon={images.crown}
            onRightPress={() => {
              setShowCreditsModal(true);
            }}
          />

          <HomeHeader
            viewStyle={{ marginTop: -10, marginBottom: 20 }}
            showCrown={false}
            showStreak={false}
            onCrownPress={() => {}}
            userName={localization.appkeys?.calendarTitle || 'Calendar'}
            safeSpaceLabel={localization.appkeys?.monthlyView || 'Monthly view'}
          />

          {/* Month Navigation Pill */}
          <View style={styles.monthRow}>
            <TouchableOpacity
              onPress={prevMonth}
              activeOpacity={0.7}
              style={styles.monthNavBtn}
            >
              <Image
                source={images.back}
                style={styles.monthNavIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <SolidText style={styles.monthLabel}>
              {`${MONTHS[month]} ${year}`}
            </SolidText>

            <TouchableOpacity
              onPress={nextMonth}
              activeOpacity={0.7}
              style={styles.monthNavBtn}
            >
              <Image
                source={images.forward2}
                style={styles.monthNavIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <CalendarGrid
            year={year}
            month={month}
            todayDay={todayDay}
            isCurrentMonth={isCurrentMonth}
          />

          {/* Connected Pill */}
          <ConnectedPill
            label={localization.appkeys?.connected || 'Connected'}
            count={` - 2 ${localization.appkeys?.entries || 'Entries'}`}
            onPress={() =>
              navigation.navigate(AppRoutes.ConnectedEntries as never)
            }
          />

          <View style={{ height: 40 }} />
          <GetCreditsModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};

export default Calendar;
