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
  withTiming,
  Easing,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
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
    { id: 'all', title: localization.appkeys.all },
    { id: 'new', title: localization.appkeys.new },
    { id: 'most_popular', title: localization.appkeys.mostPopular },
    { id: 'recent', title: localization.appkeys.recent },
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

  const overlayOpacity = useSharedValue(0);
  const overlayTranslateY = useSharedValue(0);
  const [fadingData, setFadingData] = useState<any[] | null>(null);
  const [fadingTitle, setFadingTitle] = useState('');

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ translateY: overlayTranslateY.value }],
  }));

  const handleCategoryChange = (catId: string) => {
    if (catId === activeTab) return;
    triggerHaptic('impactHeavy');

    // Capture snapshot of current grid data ONLY
    setFadingData([...forYouResult]);
    setFadingTitle(sectionTitle);

    setActiveTab(catId);
    setActiveCategory(catId);

    // Reset overlay position and opacity
    overlayOpacity.value = 1;
    overlayTranslateY.value = 0;

    // Slide up and fade out the overlay over the new data
    overlayOpacity.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    overlayTranslateY.value = withTiming(-150, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    setTimeout(() => {
      setFadingData(null);
      setFadingTitle('');
    }, 850);
  };

  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('impactHeavy');
                navigation.goBack();
              }}
            >
              <Image
                source={images.back}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowCreditsModal(true)}
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

          <View style={{ flexGrow: 0, flexShrink: 0 }}>
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
                  onPress={() => handleCategoryChange(cat.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Theme mixes section (Static, No Animation) */}
          <View style={{ marginLeft: -14, marginRight: -14 }}>
            <View style={[styles.sectionHeader, styles.contentPadding]}>
              <SolidText style={styles.sectionTitle}>
                {localization.appkeys.themeMixes}
              </SolidText>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(AppRoutes.ThemeSeeAll as never)
                }
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
                style={{ marginVertical: 20 }}
              />
            ) : (
              <FlatList
                horizontal
                data={themeCategories}
                keyExtractor={item => item._id}
                showsHorizontalScrollIndicator={false}
                style={styles.mixesList}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                ListEmptyComponent={
                  !isCategoryLoading ? (
                    <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                      <SolidText style={{ color: colors.brown, opacity: 0.5 }}>
                        No theme mixes found
                      </SolidText>
                    </View>
                  ) : null
                }
                renderItem={({ item }) => (
                  <HorizontalMixCard
                    image={{ uri: `${getEnvVars().fileUrl}${item.imgUrl}` }}
                    title={item.title}
                    onPress={() =>
                      navigation.navigate(
                        AppRoutes.ThemeDetail as never,
                        {
                          title: item.title,
                          categoryTheme_id: item._id,
                        } as never,
                      )
                    }
                  />
                )}
              />
            )}
          </View>

          {/* Grid section with Snapshot Overlay */}
          <View style={{ flex: 1, position: 'relative' }}>
            <FlatList
              data={forYouResult}
              keyExtractor={item => item._id}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.gridList,
                { paddingHorizontal: 14, paddingBottom: 40 },
              ]}
              ListHeaderComponent={
                <View style={{ marginLeft: -14, marginRight: -14 }}>
                  <View
                    style={[
                      styles.sectionHeader,
                      styles.contentPadding,
                      { marginBottom: 10 },
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
                        style={{ marginVertical: 20 }}
                      />
                    )}
                  </View>
                }
                ListEmptyComponent={() =>
                  !isForYouLoading ? (
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                      <SolidText style={{ color: colors.brown, opacity: 0.5 }}>
                        No themes found
                      </SolidText>
                    </View>
                  ) : null
                }
              renderItem={({ item }) => (
                <GridThemeCard
                  image={{ uri: `${getEnvVars().fileUrl}${item.imgUrl}` }}
                  onPress={() => {
                    postApi(
                      {
                        endpoint: endpoints.add_user_theme,
                        data: { homeTheme_id: item._id },
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
                    style={{ marginVertical: 20 }}
                  />
                ) : null
              }
            />

            {/* Fading overlay snapshot of the previous grid data ONLY */}
            {fadingData && (
              <Animated.View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: colors.background },
                  overlayStyle,
                ]}
              >
                <View style={{ marginLeft: -14, marginRight: -14 }}>
                  <View
                    style={[
                      styles.sectionHeader,
                      styles.contentPadding,
                      { marginBottom: 10 },
                    ]}
                  >
                    <SolidText style={styles.sectionTitle}>
                      {fadingTitle}
                    </SolidText>
                  </View>
                </View>

                <FlatList
                  data={fadingData.slice(0, 9)}
                  keyExtractor={item => item._id}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={[
                    styles.gridList,
                    { paddingHorizontal: 14, paddingBottom: 40 },
                  ]}
                  renderItem={({ item }) => (
                    <GridThemeCard
                      image={{ uri: `${getEnvVars().fileUrl}${item.imgUrl}` }}
                      onPress={() => {}}
                    />
                  )}
                />
              </Animated.View>
            )}
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
