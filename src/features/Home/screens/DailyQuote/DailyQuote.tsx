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
  ImageBackground,
  StyleSheet,
} from 'react-native';

import { useNavigation, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import FavoritesModal from '../../../../modals/FavoritesModal';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

import { useHaptic } from '../../../../hooks/useHaptic';
import useGetApi from '../../../../hooks/useGetApi';
import useInfiniteGetApi from '../../../../hooks/useInfiniteGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import usePostApi from '../../../../hooks/usePostApi';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import getEnvVars from '../../../../../env';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DailyQuote = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors, images } = useTheme() as any;
  const { triggerHaptic } = useHaptic();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const queryClient = useQueryClient();
  const { mutate: postApi } = usePostApi();
  const user = useSelector((state: any) => state.userData?.user);
  // console.log('user', user);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const viewShotRefs = useRef<{ [key: string]: ViewShot }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0].item;
      console.log('Current Item on Screen:', visibleItem);
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
  } = useInfiniteGetApi(
    endpoints.affirmation_list,
    ['getAffirmationListing', { is_liked: undefined }], // Passing is_liked here as per request
    {
      limit: 10,
    },
  );

  const handleShare = async (index: number) => {
    try {
      triggerHaptic('impactMedium');
      const uri = await viewShotRefs.current[index]?.capture();
      const quoteContent =
        typeof quotes[index] === 'string'
          ? quotes[index]
          : quotes[index].affirmation;
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

  const homeThemeUrl = user?.homeTheme?.imgUrl
    ? `${getEnvVars().fileUrl}${user.homeTheme.imgUrl}`
    : null;

  const activeColor = homeThemeUrl ? '#FFFFFF' : '#3A2110';

  // Animation value for the big center heart
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;

  const handleLike = (index: number) => {
    const item = quotes[index];
    if (!item || typeof item === 'string') return;

    const isLiked = !!item.is_liked;

    // Optimistic Update
    queryClient.setQueryData(
      ['getAffirmationListing', { is_liked: undefined }],
      (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          data: {
            ...page.data,
            result: page.data.result.map((quote: any) =>
              quote._id === item._id ? { ...quote, is_liked: !isLiked } : quote,
            ),
          },
        }));
        return { ...oldData, pages: newPages };
      },
    );

    if (!isLiked) {
      triggerHaptic('impactMedium');
      // Trigger center heart animation
      heartScale.setValue(0);
      heartOpacity.setValue(0);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(heartScale, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(heartScale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(heartOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(heartOpacity, {
            toValue: 0,
            duration: 500,
            delay: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      triggerHaptic('impactHeavy');
    }

    // Hit API in background
    postApi(
      {
        endpoint: endpoints.like_unlike_affirmation,
        data: { affirmation_id: item._id },
      },
      {
        onSuccess: () => {
          // Invalidate favorites list to keep it in sync
          queryClient.invalidateQueries({
            queryKey: ['getLikedAffirmationListing'],
          });
        },
      },
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isLiked = !!item.is_liked;
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
          {homeThemeUrl ? (
            <>
              <ImageBackground
                source={{ uri: homeThemeUrl }}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: 'rgba(0,0,0,0.25)' },
                ]}
              />
            </>
          ) : null}

          <View style={[styles.quoteContainer, { width: '100%' }]}>
            <SolidText
              style={[
                styles.quoteText,
                {
                  color: activeColor,
                  textShadowColor:
                    activeColor === '#FFFFFF'
                      ? 'rgba(0, 0, 0, 0.4)'
                      : 'transparent',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 10,
                },
              ]}
            >
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
                style={[styles.bottomIcon, { tintColor: activeColor }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleLike(index)}
            >
              <Image
                source={isLiked ? images.heartFill : images.like}
                style={[styles.bottomIcon, { tintColor: activeColor }]}
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
      edges={[]}
      containerStyle={{ backgroundColor: 'transparent' }}
      view={
        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
          <View
            style={[
              styles.headerWrapper,
              {
                paddingTop:
                  Platform.OS == 'android'
                    ? -10
                    : insets.top > 0
                    ? insets.top
                    : 20,
              },
            ]}
          >
            <HeaderCommon
              rightIcon={images.crown}
              onRightPress={() => setShowCreditsModal(true)}
              tintColor={activeColor}
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
            />
          )}

          {/* Center Heart Animation */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.centerHeartContainer,
              {
                opacity: heartOpacity,
                transform: [{ scale: heartScale }],
              },
            ]}
          >
            <Image
              source={images.heartFill}
              style={[styles.centerHeart, { tintColor: activeColor }]}
              resizeMode="contain"
            />
          </Animated.View>

          <TouchableOpacity
            onPress={() => {
              triggerHaptic('impactHeavy');
              setShowFavoritesModal(true);
            }}
            style={styles.themeBtn2}
          >
            <Image
              source={images.fav}
              style={[styles.themeIcon]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              triggerHaptic('impactHeavy');
              navigation.navigate(AppRoutes.ThemeMixes as never);
            }}
            style={styles.themeBtn}
          >
            <Image
              source={images.theme}
              style={[styles.themeIcon]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <FavoritesModal
            visible={showFavoritesModal}
            onClose={() => setShowFavoritesModal(false)}
          />

          <GetCreditsModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};

export default DailyQuote;
