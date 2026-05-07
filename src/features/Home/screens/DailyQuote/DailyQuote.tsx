import React, { useContext, useState, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DailyQuote = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { triggerHaptic } = useHaptic();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState<number[]>([]);
  const viewShotRefs = useRef<{ [key: string]: ViewShot }>({});

  const {
    data: affirmationData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGetApi(endpoints.affirmation_list, ['getAffirmationListing'], {
    limit: 10,
  });

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

  const baseQuotes = [
    localization.appkeys.homeDailyQuote,
    localization.appkeys.testimonial1,
    localization.appkeys.testimonial2,
    localization.appkeys.testimonial3,
    localization.appkeys.testimonial5,
  ].filter(Boolean);

  const apiQuotes =
    affirmationData?.pages?.flatMap(page => page?.data?.result || []) || [];
  const quotes =
    apiQuotes.length > 0
      ? apiQuotes
      : [...baseQuotes, ...baseQuotes, ...baseQuotes];

  // Animation value for the big center heart
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;

  const handleLike = (index: number) => {
    const isLiked = likedQuotes.includes(index);
    if (!isLiked) {
      setLikedQuotes([...likedQuotes, index]);
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
      setLikedQuotes(likedQuotes.filter(i => i !== index));
      triggerHaptic('impactHeavy');
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isLiked = likedQuotes.includes(index);
    const quoteContent = typeof item === 'string' ? item : item.affirmation;

    return (
      <View style={styles.slideContainer}>
        <ViewShot
          ref={ref => {
            if (ref) viewShotRefs.current[index] = ref;
          }}
          options={{ format: 'png', quality: 0.9 }}
          style={styles.captureContainer}
        >
          <View style={styles.quoteContainer}>
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
              onPress={() => handleLike(index)}
            >
              <Image
                source={isLiked ? images.heartFill : images.like}
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
              rightIcon={images.crown}
              onRightPress={() => setShowCreditsModal(true)}
            />
          </View>

          <FlatList
            data={quotes}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id || index.toString()}
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
          />

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
              style={styles.centerHeart}
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
              style={styles.themeIcon}
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
              style={styles.themeIcon}
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
