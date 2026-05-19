import React, { cloneElement, useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  BackHandler,
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
import ProgressTrackerCard from '../../../../components/ProgressTrackerCard';
import PhaseCard from '../../../../components/PhaseCard';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import useGetApi from '../../../../hooks/useGetApi';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const StartedModule = () => {
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const route = useRoute();
  const { subModule } = route.params as any;
  const [phases, setPhases] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [subModuleDetail, setSubModuleDetail] = useState<any>(subModule);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { mutate: startLesson, isPending: isStarting } = usePostApi();
  const { data, isLoading, refetch, isFetching } = useGetApi(
    endpoints.phase_list,
    ['phase_list', subModule?._id, cursor],
    {
      sub_module_id: subModule?._id,
      cursor,
      limit: 10,
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
      if (responseData.subModule) {
        setSubModuleDetail(responseData.subModule);
      }
      const fetchedPhases = (responseData.phases || []).map(
        (p: any, index: number) => ({
          ...p,
          phaseNumber: index + 1,
        }),
      );
      if (cursor === null) {
        setPhases(fetchedPhases);
      } else {
        setPhases(prev => [...prev, ...fetchedPhases]);
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
    }, 2000);
  };
  const loadMore = () => {
    const nextCursor = data?.data?.nextCursor || data?.data?.next_cursor;
    if (nextCursor && !isFetching) {
      setCursor(nextCursor);
    }
  };
  const renderHeader = useCallback(
    () => (
      <>
        <View style={styles.headerTextContainer}>
          <SolidText
            style={[
              styles.title,
              {
                color: colors.brown,
              },
            ]}
          >
            {subModuleDetail?.title ||
              localization.appkeys?.trueFriendshipTitle ||
              'What is a True Friendship?'}
          </SolidText>
          <SolidText
            style={[
              styles.subtitle,
              {
                color: colors.brown,
              },
            ]}
          >
            {subModuleDetail?.description ||
              localization.appkeys?.trueFriendshipDesc ||
              'We often say we have friends — but what does that really mean?'}
          </SolidText>
        </View>

        {/* Progress Circles */}
        {phases.length > 0 && (
          <View style={styles.progressRow}>
            {phases.map((phaseItem, index) => {
              const isCompleted = phaseItem?.isCompleted;
              const step = index + 1;
              return (
                <React.Fragment key={phaseItem?._id || step}>
                  <View style={styles.circleContainer}>
                    <View
                      style={
                        isCompleted ? styles.circleActive : styles.circleInactive
                      }
                    >
                      <SolidText
                        style={
                          isCompleted
                            ? styles.circleTextActive
                            : styles.circleTextInactive
                        }
                      >
                        {step}
                      </SolidText>
                    </View>
                  </View>
                  {index < phases.length - 1 && (
                    <View
                      style={[styles.line, isCompleted && styles.lineActive]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        )}


        <SolidText
          style={[
            styles.sectionTitle,
            {
              color: colors.brown,
            },
          ]}
        >
          {localization.appkeys?.phases || 'Phases'}
        </SolidText>
      </>
    ),
    [styles, subModuleDetail, localization.appkeys, colors.brown, navigation, phases],
  );
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isLocked = item?.isLocked;
      return (
        <PhaseCard
          phase={
            item.phase ||
            `${localization.appkeys?.phase || 'Phase'} ${item.phaseNumber}`
          }
          title={item.title}
          points={`${item.points || 0} Pts`}
          isLocked={isLocked}
          isCompleted={item.isCompleted}
          onPress={() => {
            if (isStarting) return;
            if (!isLocked && !item.isCompleted) {

              triggerHaptic('impactMedium');
              startLesson(
                {
                  endpoint: endpoints.start_lesson,
                  data: {
                    phase_id: item?._id,
                  },
                },
                {
                  onSuccess: () => {
                    (navigation.navigate as any)(
                      AppRoutes.ModuleExercise,
                      {
                        phase: item,
                        isLastPhase: index === phases.length - 1,
                        theme: (route.params as any)?.theme,
                        subModule: subModuleDetail,
                        source: (route.params as any)?.source,
                      },
                    );
                  },
                },
              );
            }
          }}
        />
      );
    },
    [
      localization.appkeys,
      navigation,
      phases.length,
      startLesson,
      isStarting,
      route.params,
      subModuleDetail,
    ],
  );
  const keyExtractor = useCallback(
    (item: any, index: number) => (item._id || index).toString(),
    [],
  );
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [navigation]);
  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          <View style={{ paddingHorizontal: 20 }}>
            <HeaderCommon
              title={localization.appkeys?.tabModules || 'Modules'}
              viewStyle={{ marginBottom: -2 }}
            />
          </View>
          <FlatList
            data={phases}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
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
          />
        </View>
      }
    />
  );
};
export default StartedModule;
