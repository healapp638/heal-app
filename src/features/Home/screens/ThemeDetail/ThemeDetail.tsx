import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Toast from '../../../../components/Toast';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import useInfiniteGetApi from '../../../../hooks/useInfiniteGetApi';
import usePostApi from '../../../../hooks/usePostApi';
import { useQueryClient } from '@tanstack/react-query';
import { endpoints } from '../../../../api/Services/endpoints';
import GridThemeCard from '../../../../components/GridThemeCard';
import getEnvVars from '../../../../../env';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetail } from '../../../../redux/Reducers/userData';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import PremiumModal from '../../../../modals/PremiumModal';
const ThemeDetail = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const route = useRoute() as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const { mutate: postApi, isLoading: isAddingTheme } = usePostApi();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state: any) => state.userData.user);
  // Title and category ID passed from navigation params
  const { title, categoryTheme_id } = route.params || {
    title: 'Abstract',
  };
  const [optimisticThemeId, setOptimisticThemeId] = useState<string | null>(
    user?.homeTheme?._id || user?.homeTheme || null,
  );

  useEffect(() => {
    const themeId = user?.homeTheme?._id || user?.homeTheme;
    if (themeId) {
      setOptimisticThemeId(themeId);
    }
  }, [user?.homeTheme]);
  const {
    data: themeDataApi,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteGetApi(
    endpoints.get_home_theme_listing,
    ['getHomeThemeListingByCategory', categoryTheme_id],
    {
      categoryTheme_id: categoryTheme_id,
      limit: 15,
    },
  );
  const themeItems =
    themeDataApi?.pages?.flatMap(page => page?.data?.result || []) || [];

  const { width: SCREEN_WIDTH } = Dimensions.get('window');

  const getItemLayout = React.useCallback(
    (data: any, index: number) => {
      const CARD_WIDTH = (SCREEN_WIDTH - 28) / 3 - 12;
      const CARD_HEIGHT = CARD_WIDTH / 0.75;
      const ROW_HEIGHT = CARD_HEIGHT + 12;
      const row = Math.floor(index / 3);
      return {
        length: ROW_HEIGHT,
        offset: ROW_HEIGHT * row,
        index,
      };
    },
    [SCREEN_WIDTH],
  );

  const renderItem = React.useCallback(({ item }: { item: any }) => {
    return (
      <GridThemeCard
        image={{
          uri: `${getEnvVars().fileUrl}${item.imgUrl}`,
        }}
        isSelected={
          optimisticThemeId
            ? optimisticThemeId === item._id
            : item.isSelected ||
              user?.homeTheme === item._id ||
              user?.homeTheme?._id === item._id
        }
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
    );
  }, [optimisticThemeId, user?.homeTheme, queryClient, postApi, dispatch]);
  return (
    <SolidView
      view={
        <View style={styles.container}>
          <View
            style={{
              paddingHorizontal: 18,
            }}
          >
            <HeaderCommon title={title} />
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{
                flex: 1,
              }}
            />
          ) : (
            <FlatList
              data={themeItems}
              extraData={optimisticThemeId}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={3}
              style={{
                width: '100%',
                paddingHorizontal: 8,
                marginTop: -10,
              }}
              contentContainerStyle={[
                styles.gridContainer,
                {
                  paddingBottom: 40,
                },
              ]}
              showsVerticalScrollIndicator={false}
              getItemLayout={getItemLayout}
              initialNumToRender={15}
              maxToRenderPerBatch={15}
              windowSize={5}
              removeClippedSubviews={Platform.OS === 'android'}
              ListEmptyComponent={() =>
                !isLoading ? (
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: 60,
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
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
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
          )}
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
export default ThemeDetail;
