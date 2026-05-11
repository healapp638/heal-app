import React, { useContext, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
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
import { endpoints } from '../../../../api/Services/endpoints';

import GridThemeCard from '../../../../components/GridThemeCard';
import getEnvVars from '../../../../../env';
import { useDispatch } from 'react-redux';
import { getUserDetail } from '../../../../redux/Reducers/userData';

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
  // Title and category ID passed from navigation params
  const { title, categoryTheme_id } = route.params || { title: 'Abstract' };

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

  const renderItem = ({ item }: { item: any }) => (
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
            onError: (error: any) => {
              setToastMsg(error.message);
            },
          },
        );
        // setShowCreditsModal(true);
      }}
    />
  );

  return (
    <SolidView
      view={
        <View style={styles.container}>
          <View style={{ paddingHorizontal: 18 }}>
            <HeaderCommon title={title} />
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ flex: 1 }}
            />
          ) : (
            <FlatList
              data={themeItems}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={3}
              style={{ width: '100%', paddingHorizontal: 8, marginTop: -10 }}
              contentContainerStyle={[
                styles.gridContainer,
                { paddingBottom: 40 },
              ]}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() =>
                !isLoading ? (
                  <View style={{ alignItems: 'center', marginTop: 60 }}>
                    <SolidText style={{ color: colors.brown, opacity: 0.5 }}>
                      No themes found
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
                    style={{ marginVertical: 20 }}
                  />
                ) : null
              }
            />
          )}
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

export default ThemeDetail;
