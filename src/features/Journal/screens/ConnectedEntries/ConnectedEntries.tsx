import React, { useContext, useState } from 'react';
import { View, FlatList, Platform } from 'react-native';
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

const ConnectedEntries = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

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
            onRightPress={() => setShowCreditsModal(true)}
          />

          <HomeHeader
            viewStyle={{ marginTop: -10, marginBottom: 20 }}
            showCrown={false}
            showStreak={false}
            onCrownPress={() => {}}
            userName={`20 ${localization.appkeys?.monthApr || 'April'} 2026`}
            safeSpaceLabel={`2 ${localization.appkeys?.entries || 'entries'}`}
          />

          {/* List Content */}
          <FlatList
            data={mockEntries}
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
                onPress={() => setSelectedEntry(item)}
              />
            )}
          />

          <JournalDetailsModal
            visible={!!selectedEntry}
            onClose={() => setSelectedEntry(null)}
            entry={selectedEntry}
            localization={localization}
          />
          <GetCreditsModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};

export default ConnectedEntries;
