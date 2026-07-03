import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  useNavigation,
  useTheme,
  useFocusEffect,
  useIsFocused,
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
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import getEnvVars from '../../../../../env';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { useDispatch } from 'react-redux';
import {
  setModuleTheme,
  setModuleSubModule,
  setModuleSource,
} from '../../../../redux/Reducers/tempData';

const Modules = () => {
  const dispatch = useDispatch();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);
  const { mutate: postApi } = usePostApi();
  const [themes, setThemes] = useState<any[]>([]);
  const [startedModules, setStartedModules] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFocused = useIsFocused();

  const {
    data: startedModulesData,
    isLoading: isStartedLoading,
    refetch: refetchStarted,
  } = useGetApi(endpoints.start_sub_module_list, ['start_sub_module_list'], {
    limit: 10,
  }, {
    enabled: isFocused,
  });
  const {
    data: finishedModulesData,
    isLoading: isFinishedLoading,
    refetch: refetchFinished,
  } = useGetApi(endpoints.end_sub_module_list, ['finished_sub_module_list'], {
    limit: 10,
  }, {
    enabled: isFocused,
  });
  const { data, isLoading, refetch, isFetching } = useGetApi(
    endpoints.theme_list,
    ['theme_list', cursor],
    {
      cursor,
      limit: 10,
    },
    {
      enabled: isFocused,
    },
  );
  const { refetch: refetchRandomQuestions } = useGetApi(
    endpoints.getRandomQuestions,
    ['getRandomQuestions'],
    {},
    {
      enabled: isFocused,
    },
  );
  useFocusEffect(
    useCallback(() => {
      setCursor(null);
    }, []),
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
        setThemes(prev => {
          const existingIds = new Set(prev.map(t => t._id || t.id));
          const newThemes = fetchedThemes.filter(
            (t: any) => !existingIds.has(t._id || t.id),
          );
          return [...prev, ...newThemes];
        });
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
    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const { width: screenWidth } = Dimensions.get('window');
  const carouselCardWidth = screenWidth - 40;

  const activeStarted = startedModules.filter(
    (item: any) => item?.completed_phase_count < item?.total_phase_count,
  );
  const finishedList = finishedModulesData?.data?.subModules || [];

  const latestStartedItem = activeStarted.length > 0 ? activeStarted[0] : null;
  const latestFinishedItem = finishedList.length > 0 ? finishedList[0] : null;

  const carouselData = [
    latestStartedItem
      ? { ...latestStartedItem, group: 'started', isEmpty: false }
      : { group: 'started', isEmpty: true },
    latestFinishedItem
      ? { ...latestFinishedItem, group: 'finished', isEmpty: false }
      : { group: 'finished', isEmpty: true },
  ];

  const currentItem = carouselData[activeIndex];
  const currentGroup = currentItem?.group || 'started';
  const isCurrentEmpty = currentItem?.isEmpty;

  const carouselTitle =
    currentGroup === 'finished'
      ? localization.appkeys?.finishedModules || 'Finished Modules'
      : localization.appkeys?.startedModules || 'Started Modules';

  const handleSeeAll = () => {
    triggerHaptic('impactMedium');
    return navigation.navigate(
      AppRoutes.AllModules as never,
      {
        type: currentGroup,
      } as never,
    );
  };

  const handleScrollEnd = useCallback(
    (event: any) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / carouselCardWidth);
      if (index >= 0 && index < carouselData.length && index !== activeIndex) {
        setActiveIndex(index);
      }
    },
    [carouselData.length, activeIndex, carouselCardWidth],
  );

  const renderCarouselItem = useCallback(
    ({ item }: { item: any }) => {
      const isFinished = item.group === 'finished';
      if (item.isEmpty) {
        return (
          <StartedModuleCard
            title={
              item.group === 'started'
                ? localization.appkeys?.noModuleStartedYet
                : localization.appkeys?.noModuleFinishedYet
            }
            subtitle={
              item.group === 'started'
                ? localization.appkeys?.chooseThemeBelow
                : localization.appkeys?.completedModulesAppearHere
            }
            progressText="0/0"
            isFinished={isFinished}
            disabled={true}
            containerStyle={{
              width: carouselCardWidth - 16,
              marginLeft: 8,
              marginRight: 8,
              opacity: 0.8,
            }}
            onPress={() => {}}
          />
        );
      }
      return (
        <StartedModuleCard
          title={item.title}
          subtitle={
            item.description ||
            localization.appkeys?.moduleRelationshipBasics ||
            'RELATIONSHIP BASICS'
          }
          progressText={`${item.completed_phase_count}/${item.total_phase_count}`}
          isFinished={isFinished}
          containerStyle={{
            width: carouselCardWidth - 16,
            marginLeft: 8,
            marginRight: 8,
          }}
          onPress={() => {
            triggerHaptic('impactMedium');
            dispatch(
              setModuleSubModule({
                ...item,
                _id: item.sub_module_id,
              }),
            );
            dispatch(setModuleSource('dashboard'));
            navigation.navigate(AppRoutes.StartedModule as never);
          }}
        />
      );
    },
    [localization.appkeys, navigation, carouselCardWidth, dispatch],
  );

  const HeaderComponent = React.useMemo(() => (
    <View>
      {/* Progress Tracker Card */}
      <ProgressTrackerCard
        viewStyle={styles.progressCardMargin}
        title={localization.appkeys?.homeProgressTracker || 'Progress Tracker'}
        onPress={() => {
          return navigation.navigate(AppRoutes.ProgressTracker as never);
        }}
      />

      {(isStartedLoading || isFinishedLoading) && carouselData.length === 0 ? (
        <ActivityIndicator
          size="small"
          color={colors.brown}
          style={{ marginVertical: 20 }}
        />
      ) : (
        carouselData?.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <SolidText
                maxFontScale={1.2}
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.brown,
                  },
                ]}
              >
                {carouselTitle}
              </SolidText>
              {!isCurrentEmpty && (
                <TouchableOpacity onPress={handleSeeAll}>
                  <SolidText maxFontScale={1.2} style={styles.seeAllText}>
                    {localization.appkeys?.seeAll || 'See All'}
                  </SolidText>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={carouselData}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={renderCarouselItem}
              keyExtractor={(item, index) =>
                item._id
                  ? `${item._id}_${index}`
                  : item.sub_module_id
                  ? `${item.sub_module_id}_${index}`
                  : index.toString()
              }
              onMomentumScrollEnd={handleScrollEnd}
              onScrollEndDrag={handleScrollEnd}
              decelerationRate="fast"
              style={{ width: carouselCardWidth, overflow: 'hidden' }}
              contentContainerStyle={{ paddingVertical: 8 }}
            />

            {carouselData.length > 1 && (
              <View style={styles.paginationContainer}>
                {carouselData.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      {
                        backgroundColor:
                          index === activeIndex ? colors.brown : '#EBE0D0',
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        )
      )}

      {/* Modules Themes Title */}
      <SolidText
        maxFontScale={1.2}
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
  ), [
    styles.progressCardMargin,
    styles.sectionHeader,
    styles.sectionTitle,
    styles.seeAllText,
    styles.paginationContainer,
    styles.paginationDot,
    localization.appkeys,
    navigation,
    isStartedLoading,
    isFinishedLoading,
    carouselData,
    colors.brown,
    carouselTitle,
    isCurrentEmpty,
    handleSeeAll,
    renderCarouselItem,
    carouselCardWidth,
    handleScrollEnd,
    activeIndex,
  ]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ModuleThemeCard
        item={item}
        onPress={() => {
          triggerHaptic('impactMedium');
          postApi(
            {
              endpoint: endpoints.theme_engagement_create,
              data: {
                theme_id: item._id || item.id,
              },
            },
            {
              onSuccess: (res: any) => {
                // console.log('theme_engagement_create success', res);
              },
              onError: (error: any) => {
                // console.log('theme_engagement_create error', error);
              },
            },
          );
          dispatch(setModuleTheme(item));
          return navigation.navigate(AppRoutes.ModuleThemeDetail as never);
        }}
      />
    ),
    [navigation, dispatch, postApi],
  );
  const keyExtractor = useCallback(
    (item: any, index: number) =>
      item._id
        ? `${item._id}_${index}`
        : item.id
        ? `${item.id}_${index}`
        : index.toString(),
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
            ListHeaderComponent={HeaderComponent}
            // onEndReached={loadMore}
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
        </View>
      }
    />
  );
};
export default Modules;
