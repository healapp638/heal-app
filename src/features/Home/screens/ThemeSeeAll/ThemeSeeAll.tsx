import React, { useContext } from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';

import CategoryGridCard from '../../../../components/CategoryGridCard';

const ThemeSeeAll = () => {
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);

  const { data: themeCategoryData, isLoading } = useGetApi(
    endpoints.get_home_theme_category,
    ['getHomeThemeCategory'],
  );

  const themeCategories = (themeCategoryData as any)?.data || [];

  const renderItem = ({ item }: { item: any }) => (
    <CategoryGridCard
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
  );

  return (
    <SolidView
      view={
        <View style={styles.container}>
          <View style={{ paddingHorizontal: 18 }}>
            <HeaderCommon title={localization.appkeys.themeMixes} />
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ flex: 1 }}
            />
          ) : (
            <FlatList
              style={{
                alignSelf: 'center',
                marginTop: -10,
                paddingHorizontal: 10,
              }}
              data={themeCategories}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={2}
              contentContainerStyle={styles.gridContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      }
    />
  );
};

import { StyleSheet } from 'react-native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import getEnvVars from '../../../../../env';

export default ThemeSeeAll;
