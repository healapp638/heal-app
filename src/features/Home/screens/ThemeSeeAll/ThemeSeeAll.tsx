import React, { useContext } from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

const ThemeSeeAll = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);

  const themeMixesData = [
    { id: '1', title: 'Colorful', image: images.t1 },
    { id: '2', title: 'Texture', image: images.t2 },
    { id: '3', title: 'Abstract', image: images.t3 },
    { id: '4', title: 'Animal', image: images.t4 },
    { id: '5', title: 'Food', image: images.t5 },
    { id: '6', title: 'Space', image: images.t6 },
    { id: '7', title: 'Nature', image: images.t7 },
    { id: '8', title: 'Plants', image: images.t8 },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ width: '47.5%', height: 100, margin: 5 }}
      onPress={() =>
        navigation.navigate(
          AppRoutes.ThemeDetail as never,
          {
            title: item.title,
          } as never,
        )
      }
    >
      <ImageBackground
        source={item.image}
        style={StyleSheet.absoluteFill}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      ></ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SolidView
      view={
        <View style={styles.container}>
          <View style={{ paddingHorizontal: 18 }}>
            <HeaderCommon title={localization.appkeys.themeMixes} />
          </View>

          <FlatList
            style={{
              alignSelf: 'center',
              marginTop: -10,
              paddingHorizontal: 10,
            }}
            data={themeMixesData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      }
    />
  );
};

import { StyleSheet } from 'react-native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

export default ThemeSeeAll;
