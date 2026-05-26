import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import JournalEntryCard from '../../../../components/JournalEntryCard';
import JournalDetailsModal from '../../../../modals/JournalDetailsModal';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import HomeHeader from '../../../../components/HomeHeader';
import JournalSearchBar from '../../../../components/JournalSearchBar';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import PremiumModal from '../../../../modals/PremiumModal';
const Journal = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization, appLanguage } = useContext(LocalizationContext) as any;
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
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const { data, isLoading, refetch, isFetching, error } = useGetApi(
    endpoints.get_journals,
    ['journals', page, search],
    {
      page,
      limit: 8,
      search_key: search,
    },
  );
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      refetch();
    }, [refetch]),
  );
  useEffect(() => {
    if (data?.data?.result) {
      const fetchedEntries = data?.data?.result?.map((item: any) => {
        const dateObj = new Date(item.createdAt);
        const day = dateObj.getDate();
        const monthIndex = dateObj.getMonth();
        const year = dateObj.getFullYear();
        const monthName = MONTHS[monthIndex];
        const itemDate =
          appLanguage === 'English'
            ? `${monthName} ${day}, ${year}`
            : `${day} ${monthName} ${year}`;
        return {
          ...item,
          id: item._id,
          time: new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          tag: item?.feeling
            ? item.feeling.charAt(0).toUpperCase() + item.feeling.slice(1)
            : '',
          body: item?.description,
          date: itemDate,
          groupDate: itemDate,
        };
      });
      if (page === 1) {
        setEntries(fetchedEntries);
      } else {
        setEntries(prev => [...prev, ...fetchedEntries]);
      }
      setTotalEntries(data?.data?.totalCount || 0);
    }
    setIsRefreshing(false);
  }, [data]);
  useEffect(() => {
    setPage(1);
  }, [search]);
  const onRefresh = () => {
    setIsRefreshing(true);
    if (page === 1) {
      refetch();
    } else {
      setPage(1);
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  const loadMore = () => {
    if (entries.length < totalEntries && !isFetching) {
      setPage(prev => prev + 1);
    }
  };
  const handleAddEntry = () => {
    navigation.navigate(AppRoutes.AddJournal as never);
  };
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={images.bigJournal}
        style={styles.bigJournalIcon}
        resizeMode="contain"
      />
      <SolidText style={styles.welcomeTitle}>
        {localization.appkeys?.welcomeToSpace || 'Welcome to your space'}
      </SolidText>
      <SolidText style={styles.welcomeDesc}>
        {localization.appkeys?.journalWelcomeDesc ||
          "This place is yours. Write down what you feel; I'm here to listen with kindness."}
      </SolidText>
    </View>
  );
  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          {/* Header */}
          <HomeHeader
            showCrown
            showStreak={false}
            onCrownPress={() => {
              setShowCreditsModal(true);
            }}
            userName={localization.appkeys?.journalTitle || 'Journal'}
            safeSpaceLabel={
              localization.appkeys?.journalSubtitle || 'Your private space'
            }
          />
          {/* Search Bar */}
          <JournalSearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={localization.appkeys?.searchPlaceholder || 'Search...'}
            onCalendarPress={() => {
              triggerHaptic('impactMedium');
              return navigation.navigate(AppRoutes.Calendar as never);
            }}
          />

          {/* Date headers are now rendered inline via renderItem */}

          <FlatList
            data={entries}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={!isLoading ? renderEmptyState : null}
            style={{
              padding: 2,
              marginTop: Platform.OS == 'ios' ? 0 : -8,
            }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={
              isFetching && page !== 1 ? (
                <ActivityIndicator
                  size="small"
                  color={colors.brown}
                  style={{
                    marginVertical: 20,
                  }}
                />
              ) : null
            }
            renderItem={({ item, index }) => {
              const showDateHeader =
                index === 0 || item.groupDate !== entries[index - 1]?.groupDate;
              return (
                <>
                  {showDateHeader && (
                    <SolidText style={styles.dateTitle}>{item.date}</SolidText>
                  )}
                  <JournalEntryCard
                    time={item.time}
                    tag={item.tag}
                    title={item.title}
                    body={item.body}
                    onPress={() => {
                      triggerHaptic('impactMedium');
                      return setSelectedEntry(item);
                    }}
                  />
                </>
              );
            }}
          />

          {/* Floating Action Button */}
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.8}
            onPress={(...args: any) => {
              triggerHaptic('impactMedium');

              return (handleAddEntry as any)(...args);
            }}
          >
            <Image
              source={images.bigPlus}
              style={styles.bigPlusIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <PremiumModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
          <JournalDetailsModal
            visible={!!selectedEntry}
            onClose={() => setSelectedEntry(null)}
            entry={selectedEntry}
            localization={localization}
          />
        </View>
      }
    />
  );
};
export default Journal;
