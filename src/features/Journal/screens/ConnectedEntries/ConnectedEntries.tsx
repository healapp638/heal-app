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

  const getLocalizedFeeling = (feeling: string) => {
    if (!feeling) return '';
    const f = feeling.toLowerCase().trim();
    
    // calm / calma / tranquilo / calmo / calme / ruhig / gelassen / спокойно / спокойный / спокойствие / gelassenheit / tranquillità / tranquillidade
    if (
      f === 'calm' ||
      f === 'calma' ||
      f === 'tranquilo' ||
      f === 'calmo' ||
      f === 'calme' ||
      f === 'ruhig' ||
      f === 'gelassen' ||
      f === 'спокойно' ||
      f === 'спокойный' ||
      f === 'спокойствие' ||
      f === 'gelassenheit' ||
      f === 'tranquillità' ||
      f === 'tranquillidade'
    ) {
      return localization.appkeys?.feelingCalm || 'Calm';
    }
    // sad / triste / traurig / грустно / грустный / traurigkeit
    if (
      f === 'sad' ||
      f === 'triste' ||
      f === 'traurig' ||
      f === 'грустно' ||
      f === 'грустный' ||
      f === 'traurigkeit'
    ) {
      return localization.appkeys?.feelingSad || 'Sad';
    }
    // happy / feliz / heureux / joyeux / glücklich / felice / contento / счастливо / счастливый / радостно / радостный / felicità / felicidade / glück
    if (
      f === 'happy' ||
      f === 'feliz' ||
      f === 'heureux' ||
      f === 'joyeux' ||
      f === 'glücklich' ||
      f === 'felice' ||
      f === 'contento' ||
      f === 'счастливо' ||
      f === 'счастливый' ||
      f === 'радостно' ||
      f === 'радостный' ||
      f === 'felicità' ||
      f === 'felicidade' ||
      f === 'glück'
    ) {
      return localization.appkeys?.feelingHappy || 'Happy';
    }
    // sorrow / grief / pena / dolor / tristeza / chagrin / douleur / tristesse / kummer / trauer / dolore / pesar / dor / печально / печаль / горе / schmerz / страдание / tristezza
    if (
      f === 'sorrow' ||
      f === 'grief' ||
      f === 'pena' ||
      f === 'dolor' ||
      f === 'tristeza' ||
      f === 'chagrin' ||
      f === 'douleur' ||
      f === 'tristesse' ||
      f === 'kummer' ||
      f === 'trauer' ||
      f === 'dolore' ||
      f === 'pesar' ||
      f === 'dor' ||
      f === 'печально' ||
      f === 'печаль' ||
      f === 'горе' ||
      f === 'schmerz' ||
      f === 'страдание' ||
      f === 'tristezza'
    ) {
      return localization.appkeys?.feelingSorrow || 'Sorrow';
    }
    // thoughtful / reflective / pensativo / considerado / reflexivo / pensif / réfléchi / reflectif / nachdenklich / reflektiert / riflessivo / pensieroso / задумчиво / задумчивый / размышляющий / вдумчивый / nachdenklichkeit / premuroso / atencioso / attentionné
    if (
      f === 'thoughtful' ||
      f === 'reflective' ||
      f === 'pensativo' ||
      f === 'considerado' ||
      f === 'reflexivo' ||
      f === 'pensif' ||
      f === 'réfléchi' ||
      f === 'reflectif' ||
      f === 'nachdenklich' ||
      f === 'reflektiert' ||
      f === 'riflessivo' ||
      f === 'pensieroso' ||
      f === 'задумчиво' ||
      f === 'задумчивый' ||
      f === 'размышляющий' ||
      f === 'вдумчивый' ||
      f === 'nachdenklichkeit' ||
      f === 'premuroso' ||
      f === 'atencioso' ||
      f === 'attentionné'
    ) {
      return localization.appkeys?.feelingThoughtful || 'Thoughtful';
    }
    // hopeful / optimistic / esperanzado / esperanza / optimista / plein d'espoir / espoir / optimiste / hoffnungsvoll / hoffnung / optimistisch / speranzoso / speranza / ottimista / esperançoso / otimista / pieno di speranza / полный надежд / с надеждой / надежда / оптимистичный / обнадеживающий
    if (
      f === 'hopeful' ||
      f === 'optimistic' ||
      f === 'esperanzado' ||
      f === 'esperanza' ||
      f === 'optimista' ||
      f === "plein d'espoir" ||
      f === 'espoir' ||
      f === 'optimiste' ||
      f === 'hoffnungsvoll' ||
      f === 'hoffnung' ||
      f === 'optimistisch' ||
      f === 'speranzoso' ||
      f === 'speranza' ||
      f === 'ottimista' ||
      f === 'esperançoso' ||
      f === 'otimista' ||
      f === 'pieno di speranza' ||
      f === 'полный надежд' ||
      f === 'с надеждой' ||
      f === 'надежда' ||
      f === 'оптимистичный' ||
      f === 'обнадеживающий'
    ) {
      return localization.appkeys?.feelingHopeful || localization.appkeys?.feelingHope || 'Hopeful';
    }
    
    return feeling.charAt(0).toUpperCase() + feeling.slice(1);
  };
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
      tag: getLocalizedFeeling(item.feeling),
      body: item.description,
      date: new Date(item.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    }));
  }, [journalData, localization]);

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
                    triggerHaptic('impactMedium');
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
