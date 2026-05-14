import React, { useContext, useState, useMemo } from 'react';
import { View, FlatList, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import JournalEntryCard from '../../../../components/JournalEntryCard';
import JournalDetailsModal from '../../../../modals/JournalDetailsModal';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import HomeHeader from '../../../../components/HomeHeader';
import GetCreditsModal from '../../../../modals/GetCreditsModal';

import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import AppUtils from '../../../../utils/appUtils';
import { useCallback } from 'react';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import PremiumModal from '../../../../modals/PremiumModal';

const ConnectedEntries = () => {
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { date } = route.params || {};
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const {
    data: journalData,
    isLoading,
    refetch,
  } = useGetApi(
    endpoints.journal_list_by_date,
    ['journal_list_by_date', date],
    { date: date },
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const totalEntries = journalData?.data?.total || 0;

  const entries = useMemo(() => {
    const raw = journalData?.data?.response || [];
    return raw.map((item: any) => ({
      ...item,
      id: item._id,
      time: new Date(item.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      tag: item.feeling.charAt(0).toUpperCase() + item.feeling.slice(1),
      body: item.description,
      date: new Date(item.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    }));
  }, [journalData]);

  const formattedHeaderDate = useMemo(() => {
    if (!date) return '';
    const [y, m, d] = date.split('-');
    const monthNames = [
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
    const monthName = monthNames[parseInt(m, 10) - 1];
    return `${parseInt(d, 10)} ${monthName} ${y}`;
  }, [date, localization]);

  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          {/* Header */}
          <HeaderCommon
            title={
              localization.appkeys?.connectedEntriesTitle || 'Connected Entries'
            }
            rightIcon={images.crown}
            onRightPress={() => {
              triggerHaptic('impactLight');
              setShowCreditsModal(true);
            }}
          />

          <HomeHeader
            viewStyle={{ marginTop: -10, marginBottom: 20 }}
            showCrown={false}
            showStreak={false}
            onCrownPress={() => {}}
            userName={formattedHeaderDate}
            safeSpaceLabel={`${totalEntries} ${
              localization.appkeys?.entries || 'entries'
            }`}
          />

          {/* List Content */}
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.brown}
              style={{ marginTop: 50 }}
            />
          ) : (
            <FlatList
              data={entries}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              style={{ padding: 2, marginTop: Platform.OS == 'ios' ? 0 : -8 }}
              renderItem={({ item }) => (
                <JournalEntryCard
                  time={item.time}
                  tag={item.tag}
                  title={item.title}
                  body={item.body}
                  onPress={() => {
                    triggerHaptic('impactLight');
                    setSelectedEntry(item);
                  }}
                />
              )}
            />
          )}

          <JournalDetailsModal
            visible={!!selectedEntry}
            onClose={() => setSelectedEntry(null)}
            entry={selectedEntry}
            localization={localization}
          />
          <PremiumModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};

export default ConnectedEntries;
