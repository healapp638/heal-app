import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  useNavigation,
  useTheme,
  useFocusEffect,
} from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import ProgressTrackerCard from '../../../../components/ProgressTrackerCard';
import HomeHeader from '../../../../components/HomeHeader';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import StartedModuleCard from '../../../../components/StartedModuleCard';
import ModuleThemeCard from '../../../../components/ModuleThemeCard';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import getEnvVars from '../../../../../env';

const Modules = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);

  const [themes, setThemes] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, refetch, isFetching } = useGetApi(
    endpoints.theme_list,
    ['theme_list', cursor],
    { cursor, limit: 10 },
  );

  useFocusEffect(
    useCallback(() => {
      // Optional: refetch on focus if needed
      setCursor(null);
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (data?.data) {
      const responseData = data.data;
      const fetchedThemes = (
        responseData.data ||
        responseData.result ||
        []
      ).map((item: any) => ({
        ...item,
        icon: item.imgUrl
          ? `${getEnvVars().fileUrl}${item.imgUrl}`
          : images.romantic,
      }));

      if (cursor === null) {
        setThemes(fetchedThemes);
      } else {
        setThemes(prev => [...prev, ...fetchedThemes]);
      }
    }
    setIsRefreshing(false);
  }, [data]);

  const onRefresh = () => {
    setIsRefreshing(true);
    setCursor(null);
    refetch();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const loadMore = () => {
    const responseData = data?.data;
    const nextCursor = responseData?.nextCursor || responseData?.next_cursor;
    if (nextCursor && !isFetching) {
      setCursor(nextCursor);
    }
  };

  const renderHeader = () => (
    <View>
      {/* Header */}
      <HomeHeader
        showStreak={false}
        onCrownPress={() => {}}
        userName={localization.appkeys?.tabModules || 'Modules'}
        safeSpaceLabel={
          localization.appkeys?.modulesSubtitle || 'Choose guided support'
        }
        onStreakPress={() => {}}
      />

      {/* Progress Tracker Card */}
      <ProgressTrackerCard
        viewStyle={styles.progressCardMargin}
        title={localization.appkeys?.homeProgressTracker || 'Progress Tracker'}
        percentage="30%"
        level={localization.appkeys?.homeLevel2?.split(' ')[1] || 'Level 2'}
        points="145/500 PTS"
        onPress={() => navigation.navigate(AppRoutes.ProgressTracker as never)}
      />

      {/* Started Modules */}
      <SolidText style={[styles.sectionTitle, { color: colors.brown }]}>
        {localization.appkeys?.startedModules || 'Started Modules'}
      </SolidText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListContent}
        style={styles.horizontalList}
      >
        <StartedModuleCard
          title={localization.appkeys?.moduleRedFlags || 'Red Flags I Ignored'}
          subtitle={
            localization.appkeys?.moduleRelationshipBasics ||
            'RELATIONSHIP BASICS'
          }
          progressText="2/7"
          isFinished={false}
          onPress={() => navigation.navigate(AppRoutes.StartedModule as never)}
        />
        <StartedModuleCard
          title={
            localization.appkeys?.moduleFindingYourself || 'Finding Yourself'
          }
          subtitle={
            localization.appkeys?.moduleSelfDiscovery || 'SELF DISCOVERY'
          }
          progressText="1/5"
          isFinished={false}
          onPress={() => navigation.navigate(AppRoutes.StartedModule as never)}
        />
      </ScrollView>

      {/* Modules Themes Title */}
      <SolidText
        style={[styles.sectionTitle, { color: colors.brown, marginBottom: 10 }]}
      >
        {localization.appkeys?.modulesThemes || 'Modules Themes'}
      </SolidText>
    </View>
  );

  const renderFooter = () => (
    <View style={{ paddingBottom: 40 }}>
      {isFetching && cursor !== null && (
        <ActivityIndicator
          size="small"
          color={colors.brown}
          style={{ marginVertical: 20 }}
        />
      )}

      {/* Finished Modules */}
      <SolidText style={[styles.sectionTitle, { color: colors.brown }]}>
        {localization.appkeys?.finishedModules || 'Finished Modules'}
      </SolidText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListContent}
        style={styles.horizontalList}
      >
        <StartedModuleCard
          title={localization.appkeys?.moduleRedFlags || 'Red Flags I Ignored'}
          subtitle={
            localization.appkeys?.moduleRelationshipBasics ||
            'RELATIONSHIP BASICS'
          }
          isFinished={true}
          onPress={() => navigation.navigate(AppRoutes.StartedModule as never)}
        />
        <StartedModuleCard
          title={localization.appkeys?.moduleRedFlags || 'Red Flags I Ignored'}
          subtitle={
            localization.appkeys?.moduleRelationshipBasics ||
            'RELATIONSHIP BASICS'
          }
          isFinished={true}
          onPress={() => navigation.navigate(AppRoutes.StartedModule as never)}
        />
      </ScrollView>
    </View>
  );

  return (
    <SolidView
      isScrollEnabled={false}
      showChat
      view={
        <FlatList
          data={themes}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={({ item }) => (
            <ModuleThemeCard
              item={item}
              onPress={() =>
                navigation.navigate(
                  AppRoutes.ModuleThemeDetail as never,
                  {
                    theme: item,
                  } as never,
                )
              }
            />
          )}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={[
            styles.contentContainer,
            { paddingHorizontal: 20 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            isLoading && cursor === null ? (
              <ActivityIndicator
                size="large"
                color={colors.brown}
                style={{ marginTop: 50 }}
              />
            ) : null
          }
        />
      }
    />
  );
};

export default Modules;
