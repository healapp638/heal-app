import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Platform } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidText from './SolidText';
import ChallengeItem from './ChallengeItem';
import { LocalizationContext } from '../localization/localization';
import AppRoutes from '../routes/RouteKeys/appRoutes';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { triggerHaptic } from '../hooks/useHaptic';
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
  const navigation = useNavigation();
  const styles = useStyles(colors);
  const filteredChallenges = data.filter(item => item.category === activeTab);
  return (
    <FlatList
      data={filteredChallenges}
      keyExtractor={(item, index) => index?.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      style={{
        marginTop: 10,
        paddingHorizontal: 2,
      }}
      ListHeaderComponent={() => {
        return (
          <SolidText style={styles.headerText}>
            {localization.appkeys?.todaysCategories || 'Today’s Categories'}
          </SolidText>
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
            onPress={() => {
              triggerHaptic('impactMedium');
              return navigation.navigate(AppRoutes.Exercise as never, {
                challenge_id: item.id,
                challenge_type: activeTab,
              } as never);
            }}
          />
        );
      }}
    />
  );
};
const useStyles = (colors: any) =>
  StyleSheet.create({
    listContent: {
      paddingBottom: 40,
    },
    headerText: {
      fontSize: AppUtils.fontSize(16),
      fontFamily: AppFonts.semiBold,
      marginBottom: Platform.OS == 'ios' ? 16 : 12,
      marginTop: 10,
      color: colors.brown,
    },
  });
export default ChallengeList;
