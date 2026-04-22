import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import ChallengeItem from './ChallengeItem';
import { LocalizationContext } from '../localization/localization';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface ChallengeData {
  id: string;
  title: string;
  description?: string;
  points?: string;
  badge?: string;
  isCompleted: boolean;
  category: 'daily' | 'weekly';
}

interface ChallengeListProps {
  activeTab: 'daily' | 'weekly';
  data: ChallengeData[];
}

const ChallengeList = ({ activeTab, data }: ChallengeListProps) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;

  const filteredChallenges = data.filter(item => item.category === activeTab);

  return (
    <FlatList
      data={filteredChallenges}
      keyExtractor={(item: any) => item.id}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      style={{ marginTop: 10, paddingHorizontal: 2 }}
      ListHeaderComponent={() => {
        return (
          <SolidText style={styles.headerText}>Today’s Categories</SolidText>
        );
      }}
      renderItem={({ item }: any) => {
        return (
          <ChallengeItem
            title={item.title}
            description={item.description}
            points={item.points}
            badge={item.badge}
            isCompleted={item.isCompleted}
            onPress={() => {}}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 40,
  },
  headerText: {
    fontSize: AppUtils.fontSize(16),
    fontFamily: AppFonts.semiBold,
    marginBottom: Platform.OS == 'ios' ? 16 : 12,
    marginTop: 10,
    color: 'black',
  },
});

export default ChallengeList;
