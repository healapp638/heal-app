import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import { useTheme, useNavigation } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import CategoryTab from '../../../../components/CategoryTab';
import HorizontalMixCard from '../../../../components/HorizontalMixCard';
import GridThemeCard from '../../../../components/GridThemeCard';
import ThemeMixesHeader from './components/ThemeMixesHeader';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { useHaptic } from '../../../../hooks/useHaptic';
import useInfiniteGetApi from '../../../../hooks/useInfiniteGetApi';
import useGetApi from '../../../../hooks/useGetApi';
import usePostApi from '../../../../hooks/usePostApi';
import { useQueryClient } from '@tanstack/react-query';
import { endpoints } from '../../../../api/Services/endpoints';
import getEnvVars from '../../../../../env';
import Toast from '../../../../components/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetail } from '../../../../redux/Reducers/userData';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import PremiumModal from '../../../../modals/PremiumModal';
const ThemeMixes = () => {
  const { triggerHaptic } = useHaptic();
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state: any) => state.userData.user);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [optimisticThemeId, setOptimisticThemeId] = useState<string | null>(
    user?.homeTheme?._id || user?.homeTheme || null,
  );
  const [toastMsg, setToastMsg] = useState('');
  const { mutate: postApi, isLoading: isAddingTheme } = usePostApi();

  useEffect(() => {
    const themeId = user?.homeTheme?._id || user?.homeTheme;
    if (themeId) {
      setOptimisticThemeId(themeId);
    }
  }, [user?.homeTheme]);

  const categories = [
    {
      id: 'all',
      title: localization.appkeys.all,
    },
    {
      id: 'new',
      title: localization.appkeys.new,
    },
    {
      id: 'most_popular',
      title: localization.appkeys.mostPopular,
    },
    {
      id: 'recent',
      title: localization.appkeys.recent,
    },
  ];
  const { data: themeCategoryData, isLoading: isCategoryLoading } = useGetApi(
    endpoints.get_home_theme_category,
    ['getHomeThemeCategory'],
  );
  const themeCategories = (themeCategoryData as any)?.data || [];
  const {
    data: forYouDataApi,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isForYouLoading,
  } = useInfiniteGetApi(
    endpoints.get_home_theme_listing,
    ['getHomeThemeListing', activeCategory],
    {
      filter: activeCategory,
      limit: 12,
    },
  );

  const sectionTitle =
    activeCategory === 'all'
      ? localization.appkeys.forYou
      : categories.find(cat => cat.id === activeCategory)?.title ||
        localization.appkeys.forYou;
  const forYouResult =
    forYouDataApi?.pages?.flatMap(page => page?.data?.result || []) || [];

  const handleCategoryChange = (catId: string) => {
    if (catId === activeTab) return;
    triggerHaptic('impactMedium');
    setActiveTab(catId);
    setActiveCategory(catId);
  };
  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          {/* Grid section with Snapshot Overlay */}
          <View
            style={{
              flex: 1,
              position: 'relative',
            }}
          >
            <FlatList
              data={forYouResult}
              extraData={optimisticThemeId}
              keyExtractor={item => item._id}
              removeClippedSubviews={true}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.gridList,
                {
                  paddingHorizontal: 14,
                  paddingBottom: 40,
                },
              ]}
              ListHeaderComponent={
                <ThemeMixesHeader
                  styles={styles}
                  navigation={navigation}
                  images={images}
                  colors={colors}
                  localization={localization}
                  setShowCreditsModal={setShowCreditsModal}
                  categories={categories}
                  activeTab={activeTab}
                  handleCategoryChange={handleCategoryChange}
                  activeCategory={activeCategory}
                  isCategoryLoading={isCategoryLoading}
                  themeCategories={themeCategories}
                  sectionTitle={sectionTitle}
                  isForYouLoading={isForYouLoading}
                />
              }
              ListEmptyComponent={() =>
                !isForYouLoading ? (
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: 40,
                    }}
                  >
                    <SolidText
                      style={{
                        color: colors.brown,
                        opacity: 0.5,
                      }}
                    >
                      {localization.appkeys?.noThemesFound || 'No themes found'}
                    </SolidText>
                  </View>
                ) : null
              }
              renderItem={({ item, index }) => (
                <GridThemeCard
                  index={index}
                  itemId={item._id}
                  isSelected={
                    optimisticThemeId
                      ? optimisticThemeId === item._id
                      : item.isSelected ||
                        user?.homeTheme === item._id ||
                        user?.homeTheme?._id === item._id
                  }
                  activeCategory={activeCategory}
                  key={`${item._id}-${activeCategory}`}
                  isMostPopular={activeCategory === 'most_popular'}
                  image={{
                    uri: `${getEnvVars().fileUrl}${item.homeImgUrl}`,
                  }}
                  onPress={() => {
                    setOptimisticThemeId(item._id);
                    // Update ALL theme listing caches instantly
                    const updateCache = (oldData: any) => {
                      if (!oldData) return oldData;
                      return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                          ...page,
                          data: {
                            ...page.data,
                            result: page.data.result.map((theme: any) => ({
                              ...theme,
                              isSelected: theme._id === item._id,
                            })),
                          },
                        })),
                      };
                    };

                    queryClient.setQueriesData(
                      { queryKey: ['getHomeThemeListing'] },
                      updateCache,
                    );
                    queryClient.setQueriesData(
                      { queryKey: ['getHomeThemeListingByCategory'] },
                      updateCache,
                    );
                    triggerHaptic('impactMedium');

                    postApi(
                      {
                        endpoint: endpoints.add_user_theme,
                        data: {
                          homeTheme_id: item._id,
                        },
                      },
                      {
                        onSuccess: () => {
                          dispatch(getUserDetail() as any);
                          setToastMsg('Theme selected successfully!');
                        },
                        onError: (error: any) => {
                          setToastMsg(error.message);
                        },
                      },
                    );
                  }}
                />
              )}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <ActivityIndicator
                    color={colors.primary}
                    style={{
                      marginVertical: 20,
                    }}
                  />
                ) : null
              }
            />
          </View>

          <PremiumModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />

          {toastMsg !== '' && (
            <Toast message={toastMsg} onClose={() => setToastMsg('')} />
          )}
        </View>
      }
    />
  );
};
export default ThemeMixes;
