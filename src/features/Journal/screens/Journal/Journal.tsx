import React, { useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import JournalEntryCard from '../../../../components/JournalEntryCard';
import JournalDetailsModal from '../../../../modals/JournalDetailsModal';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import HomeHeader from '../../../../components/HomeHeader';
import JournalSearchBar from '../../../../components/JournalSearchBar';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

// Mock entries
const mockEntries = [
  {
    id: '1',
    time: '04:10 PM',
    tag: 'Hope',
    title: 'Lorem ipsum dolor',
    body: 'Lorem ipsum dolor sit amet consectetur. Consectetur vitae risus quam vivamus eget id risus malesuada.',
  },
  {
    id: '2',
    time: '06:46 PM',
    tag: 'Sorrow',
    title: 'Lorem ipsum dolor',
    body: 'Lorem ipsum dolor sit amet consectetur. Consectetur vitae risus quam vivamus eget id risus malesuada.',
  },
];

const Journal = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  // Function to simulate adding a new entry
  const handleAddEntry = () => {
    navigation.navigate(AppRoutes.AddJournal as never);
    if (entries.length === 0) {
      setEntries(mockEntries);
    } else {
      const newEntry = {
        id: Math.random().toString(),
        time: '08:00 PM',
        tag: 'Joy',
        title: 'New Entry ' + (entries.length + 1),
        body: 'This is a new journal entry added by clicking the plus button.',
      };
      setEntries([newEntry, ...entries]);
    }
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
            onCrownPress={() => {}}
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
            onCalendarPress={() => navigation.navigate(AppRoutes.Calendar as never)}
          />

          {/* List Content */}
          {entries.length > 0 && (
            <SolidText style={styles.dateTitle}>April 20, 2026</SolidText>
          )}

          <FlatList
            data={entries}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            style={{ padding: 2, marginTop: Platform.OS == 'ios' ? 0 : -8 }}
            renderItem={({ item }) => (
              <JournalEntryCard
                time={item.time}
                tag={item.tag}
                title={item.title}
                body={item.body}
                onPress={() => setSelectedEntry(item)}
              />
            )}
          />

          {/* Floating Action Button */}
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.8}
            onPress={handleAddEntry}
          >
            <Image
              source={images.bigPlus}
              style={styles.bigPlusIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

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
