import React, { useCallback, useContext, useEffect, useState } from 'react';
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

const ModuleThemeDetail = () => {
  const { colors, images } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = (route.params as any) || {};
  const { localization } = useContext(LocalizationContext) as any;

  const [modules, setModules] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [themeDetail, setThemeDetail] = useState<any>(theme);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, refetch, isFetching } = useGetApi(
    endpoints.module_list,
    ['module_list', theme?._id, cursor],
    { theme_id: theme?._id, cursor, limit: 10 },
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
      if (responseData.theme) {
        setThemeDetail(responseData.theme);
      }
      const fetchedModules = responseData.moduleList || [];
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
    }, 2000);
  };

  const loadMore = () => {
    const nextCursor = data?.data?.nextCursor || data?.data?.next_cursor;
    if (nextCursor && !isFetching) {
      setCursor(nextCursor);
    }
  };

  const sectionColors = [
    { text: '#986455', border: '#E2D2CA' },
    { text: '#776151', border: '#C8BDB2' },
    { text: '#F66F76', border: '#F6C1C5' },
  ];

  const renderHeader = useCallback(
    () => (
      <View style={{ paddingTop: 10 }}>
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
            navigation.navigate(AppRoutes.ProgressTracker as never);
          }}
        />
      </View>
    ),
    [styles, themeDetail, localization.appkeys, navigation],
  );

  const renderFooter = useCallback(
    () => (
      <View style={{ height: 40 }}>
        {isFetching && cursor !== null && (
          <ActivityIndicator
            size="small"
            color={colors.brown}
            style={{ marginVertical: 20 }}
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
                key={sub._id || subIndex}
                sub={sub}
                colorSet={colorSet}
                isCompleted={isCompleted}
                images={images}
                colors={colors}
                styles={styles}
                onPress={() => {
                  if (!isCompleted) {
                    navigation.navigate(
                      AppRoutes.StartedModule as never,
                      {
                        module: moduleItem,
                        subModule: sub,
                        theme: themeDetail,
                        source: 'theme',
                      } as never,
                    );
                  }
                }}
              />
            );
          })}
        </View>
      );
    },
    [styles, navigation, images, colors, sectionColors],
  );

  const keyExtractor = useCallback(
    (item: any, index: number) => (item._id || index).toString(),
    [],
  );

  return (
    <SolidView
      isScrollEnabled={false}
      view={
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 20 }}>
            <HeaderCommon
              title={themeDetail?.title || 'Modules'}
              viewStyle={{ marginBottom: -2 }}
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
                  style={{ marginTop: 50 }}
                />
              ) : null
            }
          />
        </View>
      }
    />
  );
};

export default ModuleThemeDetail;
