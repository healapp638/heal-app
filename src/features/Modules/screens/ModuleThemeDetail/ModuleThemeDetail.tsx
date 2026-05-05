import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
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

const ModuleThemeDetail = () => {
  const { colors, images } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = route.params as any;
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

  const renderHeader = () => (
    <View>
      <HeaderCommon title={localization.appkeys?.tabModules || 'Modules'} />

      <SolidText style={styles.title}>
        {themeDetail?.title || localization.appkeys?.friendship || 'Friendship'}
      </SolidText>
      <SolidText style={styles.subtitle}>
        {themeDetail?.description ||
          localization.appkeys?.friendshipSubtitle ||
          'Understanding, healing and building your friendships'}
      </SolidText>

      <ProgressTrackerCard
        viewStyle={styles.progressCardMargin}
        title={localization.appkeys?.homeProgressTracker || 'Progress Tracker'}
        percentage="30%"
        level={localization.appkeys?.level || 'Level 2'}
        points="145/500 PTS"
        onPress={() => {
          navigation.navigate(AppRoutes.ProgressTracker as never);
        }}
      />
    </View>
  );

  const renderFooter = () => (
    <View style={{ height: 40 }}>
      {isFetching && cursor !== null && (
        <ActivityIndicator
          size="small"
          color={colors.brown}
          style={{ marginVertical: 20 }}
        />
      )}
    </View>
  );

  return (
    <SolidView
      isScrollEnabled={false}
      view={
        <FlatList
          data={modules}
          keyExtractor={(item, index) => (item._id || index).toString()}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          style={styles.mainContainer}
          renderItem={({ item: moduleItem, index: moduleIndex }) => {
            const colorSet = sectionColors[moduleIndex % sectionColors.length];
            return (
              <View>
                <SolidText style={styles.sectionTitle}>
                  {moduleItem.title}
                </SolidText>
                {(moduleItem.sub_modules || []).map(
                  (sub: any, subIndex: number) => (
                    <TouchableOpacity
                      key={sub._id || subIndex}
                      onPress={() =>
                        navigation.navigate(
                          AppRoutes.StartedModule as never,
                          {
                            module: moduleItem,
                            subModule: sub,
                          } as never,
                        )
                      }
                      style={styles.itemCard}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.itemCircle,
                          { borderColor: colorSet.border },
                        ]}
                      >
                        <SolidText
                          style={[styles.circleText, { color: colorSet.text }]}
                        >
                          {`${sub.totalCompletedPhaseCount || 0}/${
                            sub.totalPhaseCount || 0
                          }`}
                        </SolidText>
                      </View>

                      <SolidText style={styles.itemLabel}>
                        {sub.title}
                      </SolidText>

                      <Image
                        source={images.forward2}
                        style={styles.forwardIcon}
                        resizeMode="contain"
                        tintColor={colors.brown || '#333'}
                      />
                    </TouchableOpacity>
                  ),
                )}
              </View>
            );
          }}
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

export default ModuleThemeDetail;
