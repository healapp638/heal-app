import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
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
import ProgressTrackerCard from '../../../../components/ProgressTrackerCard';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';
import { LocalizationContext } from '../../../../localization/localization';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import SubModuleItem from '../../../../components/SubModuleItem';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { useDispatch, useSelector } from 'react-redux';
import {
  setModuleSubModule,
  setModuleSource,
  setExerciseJustCompleted,
} from '../../../../redux/Reducers/tempData';
import Loader from '../../../../modals/Loader';

const ModuleThemeDetail = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.tempData.moduleTheme);
  const exerciseJustCompleted = useSelector(
    (state: any) => state.tempData.exerciseJustCompleted,
  );
  const hasStartedFetching = useRef(false);
  const { colors, images } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const [modules, setModules] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [themeDetail, setThemeDetail] = useState<any>(theme);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [themeId] = useState(
    theme?._id || theme?.id || themeDetail?._id || themeDetail?.id,
  );
  const { data, isLoading, refetch, isFetching, isError } = useGetApi(
    endpoints.module_list,
    ['module_list', themeId, cursor],
    {
      theme_id: themeId,
      cursor,
      limit: 10,
    },
  );
  useFocusEffect(
    useCallback(() => {
      if (cursor !== null) {
        setCursor(null);
      } else {
        refetch();
      }
    }, [cursor, refetch]),
  );
  useEffect(() => {
    if (isFetching) {
      hasStartedFetching.current = true;
    }
  }, [isFetching]);
  useEffect(() => {
    if (!isFetching && hasStartedFetching.current && isError && exerciseJustCompleted) {
      setTimeout(() => {
        dispatch(setExerciseJustCompleted(false));
      }, 1000);
      hasStartedFetching.current = false;
    }
  }, [isFetching, isError, exerciseJustCompleted, dispatch]);
  useEffect(() => {
    if (data?.data) {
      const responseData = data.data;
      if (responseData.theme) {
        setThemeDetail(responseData.theme);
      }
      const fetchedModules = responseData.moduleList || [];
      if (cursor === null) {
        setModules(fetchedModules);
      } else {
        setModules(prev => {
          const existingIds = new Set(prev.map(m => m._id));
          const newModules = fetchedModules.filter(
            (m: any) => !existingIds.has(m._id),
          );
          return [...prev, ...newModules];
        });
      }
      if (!isFetching && hasStartedFetching.current && exerciseJustCompleted) {
        setTimeout(() => {
          dispatch(setExerciseJustCompleted(false));
        }, 1000);
        hasStartedFetching.current = false;
      }
    }
    setIsRefreshing(false);
  }, [data, isFetching, exerciseJustCompleted, dispatch]);
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
  const sectionColors = [
    {
      text: '#986455',
      border: '#E2D2CA',
    },
    {
      text: '#776151',
      border: '#C8BDB2',
    },
    {
      text: '#F66F76',
      border: '#F6C1C5',
    },
  ];
  const renderHeader = useCallback(
    () => (
      <View
        style={{
          paddingTop: 10,
        }}
      >
        <SolidText style={styles.title}>
          {themeDetail?.title ||
            localization.appkeys?.friendship ||
            'Friendship'}
        </SolidText>
        <SolidText style={styles.subtitle}>
          {themeDetail?.description ||
            localization.appkeys?.friendshipSubtitle ||
            'Understanding, healing and building your friendships'}
        </SolidText>

        <ProgressTrackerCard
          viewStyle={styles.progressCardMargin}
          title={
            localization.appkeys?.homeProgressTracker || 'Progress Tracker'
          }
          onPress={() => {
            //
            navigation.navigate(AppRoutes.ProgressTracker as never);
          }}
        />
      </View>
    ),
    [styles, themeDetail, localization.appkeys, navigation],
  );
  const renderFooter = useCallback(
    () => (
      <View
        style={{
          height: 40,
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
      </View>
    ),
    [isFetching, cursor, colors.brown],
  );
  const renderItem = useCallback(
    ({
      item: moduleItem,
      index: moduleIndex,
    }: {
      item: any;
      index: number;
    }) => {
      const colorSet = sectionColors[moduleIndex % sectionColors.length];
      return (
        <View>
          <SolidText style={styles.sectionTitle}>{moduleItem.title}</SolidText>
          {(moduleItem.sub_modules || []).map((sub: any, subIndex: number) => {
            const isCompleted =
              sub.totalCompletedPhaseCount === sub.totalPhaseCount &&
              sub.totalPhaseCount > 0;
            return (
              <SubModuleItem
                key={sub._id ? `${sub._id}_${subIndex}` : subIndex}
                sub={sub}
                colorSet={colorSet}
                isCompleted={isCompleted}
                images={images}
                colors={colors}
                styles={styles}
                onPress={() => {
                  triggerHaptic('impactMedium');
                  if (!isCompleted) {
                    dispatch(setModuleSubModule(sub));
                    dispatch(setModuleSource('theme'));
                    navigation.navigate(AppRoutes.StartedModule as never);
                  }
                }}
              />
            );
          })}
        </View>
      );
    },
    [styles, navigation, images, colors, sectionColors, dispatch],
  );
  const keyExtractor = useCallback(
    (item: any, index: number) =>
      item._id ? `${item._id}_${index}` : index.toString(),
    [],
  );
  return (
    <SolidView
      isScrollEnabled={false}
      view={
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              paddingHorizontal: 20,
            }}
          >
            <HeaderCommon
              title={themeDetail?.title || 'Modules'}
              viewStyle={{
                marginBottom: -2,
              }}
            />
          </View>
          <FlatList
            data={modules}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            style={styles.mainContainer}
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
          {isFetching && modules.length > 0 && cursor === null && exerciseJustCompleted && (
            <Loader />
          )}
        </View>
      }
    />
  );
};
export default ModuleThemeDetail;
