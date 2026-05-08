import React, { memo, useContext, useState, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
  Platform,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../routes/RouteKeys/appRoutes';
import SolidText from '../components/SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { LocalizationContext } from '../localization/localization';
import useInfiniteGetApi from '../hooks/useInfiniteGetApi';
import { endpoints } from '../api/Services/endpoints';
import usePostApi from '../hooks/usePostApi';
import { useQueryClient } from '@tanstack/react-query';
import Share from 'react-native-share';
import { useHaptic } from '../hooks/useHaptic';
import ViewShot from 'react-native-view-shot';

import SolidBtn from '../components/SolidBtn';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FavoritesModalProps {
  visible: boolean;
  onClose: () => void;
}

const FavoritesModal = ({ visible, onClose }: FavoritesModalProps) => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = useStyles(colors);
  const [searchText, setSearchText] = useState('');
  const queryClient = useQueryClient();
  const { triggerHaptic } = useHaptic();
  const { mutate: postApi } = usePostApi();
  const captureRef = useRef<ViewShot>(null);
  const [sharingItem, setSharingItem] = useState<any>(null);

  const {
    data: affirmationData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteGetApi(
    endpoints.liked_affirmation_list,
    ['getLikedAffirmationListing', { search_key: searchText }],
    {
      search_key: searchText,
      limit: 10,
    },
  );

  const favQuotes =
    affirmationData?.pages?.flatMap(page => page?.data?.result || []) || [];

  const handleUnlike = (item: any) => {
    triggerHaptic('impactHeavy');

    // Optimistic Update: Remove from favorites list locally
    queryClient.setQueryData(
      ['getLikedAffirmationListing', { search_key: searchText }],
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

    postApi(
      {
        endpoint: endpoints.like_unlike_affirmation,
        data: { affirmation_id: item._id },
      },
      {
        onSuccess: () => {
          refetch(); // Refetch list after unlike
        },
      },
    );
  };

  const handleShare = async (item: any) => {
    setSharingItem(item);
    // Wait for the hidden view to render with the new item
    setTimeout(async () => {
      try {
        triggerHaptic('impactMedium');
        const uri = await captureRef.current?.capture();
        const shareMessage = `${item.affirmation}\n\nFrom the Heal app:\nhttps://www.heal-app.com/`;
        if (uri) {
          await Share.open({
            url: uri,
            message: shareMessage,
            type: 'image/png',
          });
        }
      } catch (error) {
        console.log('Share error:', error);
      } finally {
        setSharingItem(null);
      }
    }, 200);
  };

  const renderFavItem = ({ item }: any) => (
    <View style={styles.card}>
      <SolidText style={styles.quoteText}>{item.affirmation}</SolidText>
      <View style={styles.cardFooter}>
        <SolidText style={styles.dateText}>
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </SolidText>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleUnlike(item)}
          >
            <Image
              source={images.heartFill}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleShare(item)}
          >
            <Image
              source={images.share}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn}>
              <Image
                source={images.back}
                style={styles.backIcon}
                resizeMode="contain"
              />
              <SolidText style={styles.backTxt}>Back</SolidText>
            </TouchableOpacity>
            <SolidText style={styles.title}>Favorites</SolidText>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.searchContainer}>
            <Image
              source={images.search}
              style={styles.searchIcon}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#A08E83"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <SolidBtn
            titleTxt="Show all in feed"
            onPress={() => {
              onClose();
              navigation.navigate(AppRoutes.SavedDailyQuote as never);
            }}
            btnStyle={styles.feedBtn}
            txtStyle={styles.feedBtnTxt}
          />

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#3A2110"
              style={{ marginTop: 20 }}
            />
          ) : (
            <FlatList
              data={favQuotes}
              renderItem={renderFavItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={() => (
                <View style={{ alignItems: 'center', marginTop: 60 }}>
                  <Image
                    source={images.heartFill}
                    style={{
                      width: 50,
                      height: 50,
                      marginBottom: 15,
                    }}
                    resizeMode="contain"
                  />
                  <SolidText style={{ color: '#A08E83' }}>
                    No favorites found
                  </SolidText>
                </View>
              )}
            />
          )}
        </View>

        {/* Hidden ViewShot for sharing with DailyQuote background */}
        {sharingItem && (
          <View
            style={{
              position: 'absolute',
              left: -AppUtils.screenWidth * 2,
              top: 0,
              width: AppUtils.screenWidth,
              height: AppUtils.screenHeight,
            }}
          >
            <ViewShot
              ref={captureRef}
              options={{ format: 'png', quality: 0.9 }}
              style={{
                width: AppUtils.screenWidth,
                height: SCREEN_HEIGHT,
                backgroundColor: colors.background,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 40,
                  backgroundColor: colors.background,
                }}
              >
                <SolidText
                  style={{
                    fontSize: AppUtils.fontSize(24),
                    fontFamily: AppFonts.reco,
                    color: '#3A2110',
                    textAlign: 'center',
                    lineHeight: 36,
                  }}
                >
                  {sharingItem.affirmation.startsWith('"')
                    ? sharingItem.affirmation
                    : `"${sharingItem.affirmation}"`}
                </SolidText>
              </View>
            </ViewShot>
          </View>
        )}
      </View>
    </Modal>
  );
};

const useStyles = (colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    sheetContainer: {
      backgroundColor: '#F4EEE2', // Light cream background from Welcome screen
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 12,
      height: SCREEN_HEIGHT * 0.9,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backIcon: {
      width: 14,
      height: 14,
      tintColor: '#3A2110', // Dark brown icons
      marginRight: 5,
    },
    backTxt: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: '#3A2110',
    },
    title: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(20),
      color: '#3A2110',
    },
    headerRight: {
      width: 50, // Balance the header
    },
    searchContainer: {
      backgroundColor: '#EAE3D5', // Slightly darker cream for search
      borderRadius: 100,
      marginHorizontal: 20,
      paddingHorizontal: 15,
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    searchIcon: {
      width: 18,
      height: 18,
      tintColor: '#3A2110',
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: '#3A2110',
      padding: 0,
    },
    feedBtn: {
      backgroundColor: '#3A2110', // Dark brown button
      height: 56,
      borderRadius: 28,
      marginHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 0,
    },
    feedBtnTxt: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: '#FFFFFF', // White text on dark button
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    card: {
      backgroundColor: '#FFFFFF', // Clean white cards
      borderRadius: 20,
      padding: 20,
      marginBottom: 15,
      // Subtle shadow for depth
      shadowColor: '#3A2110',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    quoteText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      color: '#3A2110',
      lineHeight: 24,
      marginBottom: 15,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#A08E83', // Muted brown for secondary info
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBtn: {
      marginLeft: 15,
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: '#3A2110',
    },
  });

export default memo(FavoritesModal);
