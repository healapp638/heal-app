import React, { useContext, useState, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import style from '../DailyQuote/style'; // Reuse style
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

import { useHaptic } from '../../../../hooks/useHaptic';
import useInfiniteGetApi from '../../../../hooks/useInfiniteGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import usePostApi from '../../../../hooks/usePostApi';
import { useQueryClient } from '@tanstack/react-query';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SavedDailyQuote = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { triggerHaptic } = useHaptic();
  const styles = style(colors);
  const queryClient = useQueryClient();
  const { mutate: postApi } = usePostApi();

  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const viewShotRefs = useRef<{ [key: string]: ViewShot }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0].item;
      setCurrentIndex(viewableItems[0].index);

      // Hit addView API
      if (visibleItem?._id) {
        postApi({
          endpoint: endpoints.add_view_affirmation,
          data: { affirmation_id: visibleItem._id },
        });
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const {
    data: affirmationData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteGetApi(
    endpoints.liked_affirmation_list,
    ['getLikedAffirmationListing', { search_key: '' }],
    {
      search_key: '',
      limit: 10,
    },
  );

  const handleShare = async (index: number) => {
    try {
      triggerHaptic('impactMedium');
      const uri = await viewShotRefs.current[index]?.capture();
      const quoteContent = quotes[index].affirmation;
      const shareMessage = `${quoteContent}\n\nFrom the Heal app:\nhttps://www.heal-app.com/`;

      if (uri) {
        await Share.open({
          url: uri,
          message: shareMessage,
          type: 'image/png',
        });
      }
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const apiQuotes =
    affirmationData?.pages?.flatMap(page => page?.data?.result || []) || [];
  const quotes = apiQuotes;

  const handleUnlike = (index: number) => {
    const item = quotes[index];
    if (!item) return;

    triggerHaptic('impactHeavy');

    // Optimistic Update: Remove from list locally
    queryClient.setQueryData(
      ['getLikedAffirmationListing', { search_key: '' }],
      (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          data: {
            ...page.data,
            result: page.data.result.filter(
              (quote: any) => quote._id !== item._id,
            ),
          },
        }));
        return { ...oldData, pages: newPages };
      },
    );

    // Also update the main feed if it's cached
    queryClient.setQueryData(
      ['getAffirmationListing', { is_liked: undefined }],
      (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          data: {
            ...page.data,
            result: page.data.result.map((quote: any) =>
              quote._id === item._id ? { ...quote, is_liked: false } : quote,
            ),
          },
        }));
        return { ...oldData, pages: newPages };
      },
    );

    // Hit API in background
    postApi(
      {
        endpoint: endpoints.like_unlike_affirmation,
        data: { affirmation_id: item._id },
      },
      {
        onSuccess: () => {
          refetch(); // Refetch to ensure sync
        },
      },
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const quoteContent = item.affirmation;

    return (
      <View style={styles.slideContainer}>
        <ViewShot
          ref={ref => {
            if (ref) viewShotRefs.current[index] = ref;
          }}
          options={{ format: 'png', quality: 0.9 }}
          style={[styles.captureContainer, { height: SCREEN_HEIGHT }]}
        >
          <View style={[styles.quoteContainer, { backgroundColor: colors.background, width: '100%' }]}>
            <SolidText style={styles.quoteText}>
              {quoteContent.startsWith('"')
                ? quoteContent
                : `"${quoteContent}"`}
            </SolidText>
          </View>
        </ViewShot>

        <View style={styles.footerContainer}>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleShare(index)}
            >
              <Image
                source={images.share}
                style={styles.bottomIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleUnlike(index)}
            >
              <Image
                source={images.heartFill}
                style={styles.bottomIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SolidView
      view={
        <View style={styles.container}>
          <View style={styles.headerWrapper}>
            <HeaderCommon
              title="Favourite Quotes"
              showBack={true}
              rightIcon={images.crown}
              onRightPress={() => setShowCreditsModal(true)}
            />
          </View>
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator
                size="large"
                color={colors.primary || '#3A2110'}
              />
            </View>
          ) : (
            <FlatList
              data={quotes}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              pagingEnabled
              vertical={true}
              showsVerticalScrollIndicator={false}
              snapToInterval={SCREEN_HEIGHT}
              snapToAlignment="start"
              decelerationRate="fast"
              windowSize={3}
              initialNumToRender={1}
              maxToRenderPerBatch={2}
              removeClippedSubviews={Platform.OS === 'android'}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: SCREEN_HEIGHT * 0.7,
                  }}
                >
                  <Image
                    source={images.heartFill}
                    style={{
                      width: 60,
                      height: 60,
                      marginBottom: 20,
                    }}
                    resizeMode="contain"
                  />
                  <SolidText style={{ color: '#A08E83' }}>
                    No favourites quotes found
                  </SolidText>
                </View>
              )}
            />
          )}

          <GetCreditsModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};

export default SavedDailyQuote;
