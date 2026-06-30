import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import SolidText from '../../../../../components/SolidText';
import CategoryTab from '../../../../../components/CategoryTab';
import HorizontalMixCard from '../../../../../components/HorizontalMixCard';
import AppRoutes from '../../../../../routes/RouteKeys/appRoutes';
import { triggerHaptic } from '../../../../../hooks/useHaptic';
import getEnvVars from '../../../../../../env';

interface ThemeMixesHeaderProps {
  styles: any;
  navigation: any;
  images: any;
  colors: any;
  localization: any;
  setShowCreditsModal: (show: boolean) => void;
  categories: any[];
  activeTab: string;
  handleCategoryChange: (catId: string) => void;
  activeCategory: string;
  isCategoryLoading: boolean;
  themeCategories: any[];
  sectionTitle: string;
  isForYouLoading: boolean;
}

const ThemeMixesHeader = ({
  styles,
  navigation,
  images,
  colors,
  localization,
  setShowCreditsModal,
  categories,
  activeTab,
  handleCategoryChange,
  activeCategory,
  isCategoryLoading,
  themeCategories,
  sectionTitle,
  isForYouLoading,
}: ThemeMixesHeaderProps) => {
  return (
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
            triggerHaptic('impactMedium');
          }}
        >
          <Image
            source={images.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
            triggerHaptic('impactMedium');
            return setShowCreditsModal(true);
          }}
          style={styles.unlockBtn}
        >
          <SolidText style={styles.unlockText}>
            {localization.appkeys.unlockAll}
          </SolidText>
        </TouchableOpacity> */}
      </View>

      <SolidText style={styles.title}>{localization.appkeys.themes}</SolidText>

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
          {categories?.map(cat => (
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
            <SolidText maxFontScale={1.2} style={styles.sectionTitle}>
              {localization.appkeys.themeMixes}
            </SolidText>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('impactMedium');
                return navigation.navigate(AppRoutes.ThemeSeeAll as never);
              }}
            >
              <SolidText maxFontScale={1.2} style={styles.seeAllText}>
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
                      maxFontScale={1.2}
                      style={{
                        color: colors.brown,
                        opacity: 0.5,
                      }}
                    >
                      {localization.appkeys?.noThemeMixesFound ||
                        'No theme mixes found'}
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
                    triggerHaptic('impactMedium');
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
        <SolidText style={styles.sectionTitle}>{sectionTitle}</SolidText>
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
  );
};

export default memo(ThemeMixesHeader);
