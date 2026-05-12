import React, { useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
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
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { useHaptic } from '../../../../hooks/useHaptic';
import useInfiniteGetApi from '../../../../hooks/useInfiniteGetApi';
import useGetApi from '../../../../hooks/useGetApi';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import getEnvVars from '../../../../../env';
import Toast from '../../../../components/Toast';
import { useDispatch } from 'react-redux';
import { getUserDetail } from '../../../../redux/Reducers/userData';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const ThemeMixes = () => {
  const { triggerHaptic } = useHaptic();
  const dispatch = useDispatch();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const { mutate: postApi, isLoading: isAddingTheme } = usePostApi();
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
    triggerHaptic('impactHeavy');
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
              keyExtractor={item => item._id}
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
                <View
                  style={{
                    marginLeft: -14,
                    marginRight: -14,
                  }}
                >
                  <View style={styles.headerRow}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.goBack();
                        triggerHaptic('impactHeavy');
                      }}
                    >
                      <Image
                        source={images.back}
                        style={styles.backIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        triggerHaptic('impactHeavy');
                        return setShowCreditsModal(true);
                      }}
                      style={styles.unlockBtn}
                    >
                      <SolidText style={styles.unlockText}>
                        {localization.appkeys.unlockAll}
                      </SolidText>
                    </TouchableOpacity>
                  </View>

                  <SolidText style={styles.title}>
                    {localization.appkeys.themes}
                  </SolidText>

                  <View
                    style={{
                      flexGrow: 0,
                      flexShrink: 0,
                    }}
                  >
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.categoryList}
                      contentContainerStyle={{
                        paddingHorizontal: 20,
                        marginTop: 4,
                      }}
                    >
                      {categories.map(cat => (
                        <CategoryTab
                          key={cat.id}
                          title={cat.title}
                          isActive={activeTab === cat.id}
                          onPress={() => {
                            return handleCategoryChange(cat.id);
                          }}
                        />
                      ))}
                    </ScrollView>
                  </View>

                  {/* Theme mixes section - only shown for 'all' filter */}
                  {activeCategory === 'all' && (
                    <Animated.View
                      entering={FadeInUp.duration(600)}
                      exiting={FadeOutDown.duration(600)}
                      layout={LinearTransition}
                      style={{}}
                    >
                      <View style={[styles.sectionHeader, styles.contentPadding]}>
                        <SolidText style={styles.sectionTitle}>
                          {localization.appkeys.themeMixes}
                        </SolidText>
                        <TouchableOpacity
                          onPress={() => {
                            triggerHaptic('impactHeavy');
                            return navigation.navigate(
                              AppRoutes.ThemeSeeAll as never,
                            );
                          }}
                        >
                          <SolidText style={styles.seeAllText}>
                            {localization.appkeys.seeAll}
                          </SolidText>
                        </TouchableOpacity>
                      </View>

                      {isCategoryLoading ? (
                        <ActivityIndicator
                          size="large"
                          color={colors.primary}
                          style={{
                            marginVertical: 20,
                          }}
                        />
                      ) : (
                        <FlatList
                          horizontal
                          data={themeCategories}
                          keyExtractor={item => item._id}
                          showsHorizontalScrollIndicator={false}
                          style={styles.mixesList}
                          contentContainerStyle={{
                            paddingHorizontal: 20,
                          }}
                          ListEmptyComponent={
                            !isCategoryLoading ? (
                              <View
                                style={{
                                  paddingHorizontal: 20,
                                  marginTop: 10,
                                }}
                              >
                                <SolidText
                                  style={{
                                    color: colors.brown,
                                    opacity: 0.5,
                                  }}
                                >
                                  No theme mixes found
                                </SolidText>
                              </View>
                            ) : null
                          }
                          renderItem={({ item }) => (
                            <HorizontalMixCard
                              image={{
                                uri: `${getEnvVars().fileUrl}${item.imgUrl}`,
                              }}
                              title={item.title}
                              onPress={() => {
                                triggerHaptic('impactHeavy');
                                return navigation.navigate(
                                  AppRoutes.ThemeDetail as never,
                                  {
                                    title: item.title,
                                    categoryTheme_id: item._id,
                                  } as never,
                                );
                              }}
                            />
                          )}
                        />
                      )}
                    </Animated.View>
                  )}

                  <View
                    style={[
                      styles.sectionHeader,
                      styles.contentPadding,
                      {
                        marginBottom: 10,
                      },
                    ]}
                  >
                    <SolidText style={styles.sectionTitle}>
                      {sectionTitle}
                    </SolidText>
                  </View>
                  {isForYouLoading && (
                    <ActivityIndicator
                      size="large"
                      color={colors.primary}
                      style={{
                        marginVertical: 20,
                      }}
                    />
                  )}
                </View>
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
                      No themes found
                    </SolidText>
                  </View>
                ) : null
              }
              renderItem={({ item, index }) => (
                <GridThemeCard
                  index={index}
                  itemId={item._id}
                  activeCategory={activeCategory}
                  key={`${item._id}-${activeCategory}`}
                  isMostPopular={activeCategory === 'most_popular'}
                  image={{
                    uri: `${getEnvVars().fileUrl}${item.imgUrl}`,
                  }}
                  onPress={() => {
                    triggerHaptic('impactHeavy');
                    postApi(
                      {
                        endpoint: endpoints.add_user_theme,
                        data: {
                          homeTheme_id: item._id,
                        },
                      },
                      {
                        onSuccess: () => {
                          dispatch(getUserDetail());
                          setToastMsg('Theme selected successfully!');
                        },
                        onError: error => {
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

          <GetCreditsModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />

          {isAddingTheme && (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000,
                },
              ]}
            >
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}

          {toastMsg !== '' && (
            <Toast message={toastMsg} onClose={() => setToastMsg('')} />
          )}
        </View>
      }
    />
  );
};
export default ThemeMixes;
