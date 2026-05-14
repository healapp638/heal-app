import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TouchableOpacity,
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
import HorizontalModuleList from '../../../../components/HorizontalModuleList';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import PremiumModal from '../../../../modals/PremiumModal';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import getEnvVars from '../../../../../env';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const Modules = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);
  const [themes, setThemes] = useState<any[]>([]);
  const [startedModules, setStartedModules] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const {
    data: startedModulesData,
    isLoading: isStartedLoading,
    refetch: refetchStarted,
  } = useGetApi(endpoints.start_sub_module_list, ['start_sub_module_list'], {
    limit: 10,
  });
  const {
    data: finishedModulesData,
    isLoading: isFinishedLoading,
    refetch: refetchFinished,
  } = useGetApi(endpoints.end_sub_module_list, ['finished_sub_module_list'], {
    limit: 10,
  });
  const { data, isLoading, refetch, isFetching } = useGetApi(
    endpoints.theme_list,
    ['theme_list', cursor],
    {
      cursor,
      limit: 10,
    },
  );
  useFocusEffect(
    useCallback(() => {
      // Optional: refetch on focus if needed
      setCursor(null);
      refetch();
      refetchStarted();
      refetchFinished();
    }, [refetch, refetchStarted, refetchFinished]),
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
  useEffect(() => {
    if (startedModulesData?.data?.subModules) {
      setStartedModules(startedModulesData.data.subModules);
    }
  }, [startedModulesData]);
  const onRefresh = () => {
    setIsRefreshing(true);
    setCursor(null);
    refetch();
    refetchStarted();
    refetchFinished();
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
      {/* Progress Tracker Card */}
      <ProgressTrackerCard
        viewStyle={styles.progressCardMargin}
        title={localization.appkeys?.homeProgressTracker || 'Progress Tracker'}
        onPress={() => {
          //
          return navigation.navigate(AppRoutes.ProgressTracker as never);
        }}
      />

      {startedModules.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <SolidText
              style={[
                styles.sectionTitle,
                {
                  color: colors.brown,
                },
              ]}
            >
              {localization.appkeys?.startedModules || 'Started Modules'}
            </SolidText>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('impactMedium');
                return navigation.navigate(
                  AppRoutes.AllModules as never,
                  {
                    type: 'started',
                  } as never,
                );
              }}
            >
              <SolidText style={styles.seeAllText}>
                {localization.appkeys?.seeAll || 'See All'}
              </SolidText>
            </TouchableOpacity>
          </View>
          <HorizontalModuleList
            data={startedModules.filter(
              (item: any) =>
                item.completed_phase_count < item.total_phase_count,
            )}
            isLoading={isStartedLoading}
            localization={localization}
            style={styles.horizontalList}
            contentContainerStyle={styles.horizontalListContent}
            onPress={item => {
              //
              navigation.navigate(
                AppRoutes.StartedModule as never,
                {
                  module: item.module,
                  subModule: {
                    ...item,
                    _id: item.sub_module_id,
                  },
                  source: 'dashboard',
                } as never,
              );
            }}
          />
        </>
      )}

      {/* Modules Themes Title */}
      <SolidText
        style={[
          styles.sectionTitle,
          {
            color: colors.brown,
            marginBottom: 10,
          },
        ]}
      >
        {localization.appkeys?.modulesThemes || 'Modules Themes'}
      </SolidText>
    </View>
  );
  const renderFooter = () => (
    <View
      style={{
        paddingBottom: 40,
        marginTop: 10,
      }}
    >
      {isFetching && cursor !== null && (
        <ActivityIndicator
          size="small"
          color={colors.brown}
          style={{
            marginVertical: 20,
          }}
        />
      )}

      {/* Finished Modules */}
      {(finishedModulesData?.data?.subModules || []).length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <SolidText
              style={[
                styles.sectionTitle,
                {
                  color: colors.brown,
                },
              ]}
            >
              {localization.appkeys?.finishedModules || 'Finished Modules'}
            </SolidText>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('impactMedium');
                return navigation.navigate(
                  AppRoutes.AllModules as never,
                  {
                    type: 'finished',
                  } as never,
                );
              }}
            >
              <SolidText style={styles.seeAllText}>
                {localization.appkeys?.seeAll || 'See All'}
              </SolidText>
            </TouchableOpacity>
          </View>
          <HorizontalModuleList
            data={finishedModulesData?.data?.subModules || []}
            isLoading={isFinishedLoading}
            localization={localization}
            isFinished={true}
            style={styles.horizontalList}
            contentContainerStyle={styles.horizontalListContent}
            onPress={item => {
              //
              navigation.navigate(
                AppRoutes.StartedModule as never,
                {
                  module: item.module,
                  subModule: {
                    ...item,
                    _id: item.sub_module_id,
                  },
                  source: 'dashboard',
                } as never,
              );
            }}
          />
        </>
      )}
    </View>
  );
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ModuleThemeCard
        item={item}
        onPress={() => {
          return navigation.navigate(
            AppRoutes.ModuleThemeDetail as never,
            {
              theme: item,
            } as never,
          );
        }}
      />
    ),
    [navigation],
  );
  const keyExtractor = useCallback(
    (item: any, index: number) => (item.id || index).toString(),
    [],
  );
  return (
    <SolidView
      isScrollEnabled={false}
      showChat
      view={
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
            <HomeHeader
              showStreak={false}
              showCrown
              onCrownPress={() => setShowCreditsModal(true)}
              userName={localization.appkeys?.tabModules || 'Modules'}
              safeSpaceLabel={
                localization.appkeys?.modulesSubtitle || 'Choose guided support'
              }
              onStreakPress={() => {}}
            />
          </View>
          <FlatList
            data={themes}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={[
              styles.contentContainer,
              {
                paddingHorizontal: 20,
              },
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              isLoading && cursor === null ? (
                <ActivityIndicator
                  size="large"
                  color={colors.brown}
                  style={{
                    marginTop: 50,
                  }}
                />
              ) : null
            }
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
export default Modules;
