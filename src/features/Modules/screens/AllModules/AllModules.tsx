import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  useNavigation,
  useTheme,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import StartedModuleCard from '../../../../components/StartedModuleCard';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import { endpoints } from '../../../../api/Services/endpoints';
import useGetApi from '../../../../hooks/useGetApi';
import style from './style';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const AllModules = () => {
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = (route.params as any) || {
    type: 'started',
  };
  const [modules, setModules] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const endpoint =
    type === 'started'
      ? endpoints.start_sub_module_list
      : endpoints.end_sub_module_list;
  const queryKey =
    type === 'started' ? 'all_started_modules' : 'all_finished_modules';
  const { data, isLoading, refetch, isFetching } = useGetApi(
    endpoint,
    [queryKey, cursor],
    {
      cursor,
      limit: 20,
    },
  );
  useFocusEffect(
    useCallback(() => {
      setCursor(null);
      refetch();
    }, [refetch]),
  );
  useEffect(() => {
    if (data?.data) {
      const responseData = data.data;
      const fetchedModules = responseData.subModules || [];
      if (cursor === null) {
        setModules(fetchedModules);
      } else {
        setModules(prev => [...prev, ...fetchedModules]);
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
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <StartedModuleCard
        title={item.title}
        subtitle={
          item.description ||
          localization.appkeys?.moduleRelationshipBasics ||
          'RELATIONSHIP BASICS'
        }
        progressText={`${item.completed_phase_count}/${item.total_phase_count}`}
        isFinished={type === 'finished'}
        // disabled={type === 'finished'}
        containerStyle={styles.cardContainer}
        onPress={() => {
          triggerHaptic('impactLight');
          // if (type === 'finished') return;
          navigation.navigate(
            AppRoutes.StartedModule as never,
            {
              module: item.module,
              subModule: {
                ...item,
                _id: item.sub_module_id,
              },
              source: 'all',
            } as never,
          );
        }}
      />
    ),
    [type, styles.cardContainer, navigation, localization.appkeys],
  );
  const keyExtractor = useCallback(
    (item: any, index: number) => (item._id || index).toString(),
    [],
  );
  const loadMore = () => {
    const nextCursor = data?.data?.nextCursor || data?.data?.next_cursor;
    if (nextCursor && !isFetching) {
      setCursor(nextCursor);
    }
  };
  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          <View
            style={{
              paddingHorizontal: 20,
            }}
          >
            <HeaderCommon
              title={
                type === 'started'
                  ? localization.appkeys?.startedModules || 'Started Modules'
                  : localization.appkeys?.finishedModules || 'Finished Modules'
              }
            />
          </View>

          <FlatList
            data={modules}
            style={{
              marginTop: -20,
            }}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
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
              ) : !isLoading && modules.length === 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 100,
                  }}
                >
                  <SolidText
                    style={{
                      color: colors.brown,
                      textAlign: 'center',
                    }}
                  >
                    {type === 'started'
                      ? localization.appkeys?.noStartedModulesFound ||
                        'No started modules found'
                      : localization.appkeys?.noFinishedModulesFound ||
                        'No finished modules found'}
                  </SolidText>
                </View>
              ) : null
            }
            ListFooterComponent={
              isFetching && cursor !== null ? (
                <ActivityIndicator
                  size="small"
                  color={colors.brown}
                  style={{
                    marginVertical: 20,
                  }}
                />
              ) : null
            }
            contentContainerStyle={styles.listContent}
          />
        </View>
      }
    />
  );
};
export default AllModules;
