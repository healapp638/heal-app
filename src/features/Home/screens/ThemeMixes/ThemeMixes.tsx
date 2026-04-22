import React, { useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
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

const ThemeMixes = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const categories = [
    { id: 'create', title: localization.appkeys.create, isCreate: true },
    { id: 'all', title: localization.appkeys.all },
    { id: 'abstract', title: localization.appkeys.abstract },
    { id: 'plant', title: localization.appkeys.plant },
    { id: 'space', title: localization.appkeys.space },
  ];

  const themeMixesData = [
    { id: '1', title: 'Colorful', image: images.t1 },
    { id: '2', title: 'Texture', image: images.t2 },
    { id: '3', title: 'Vibe', image: images.t3 },
    { id: '4', title: 'Nature', image: images.t4 },
    { id: '5', title: 'Ocean', image: images.t5 },
  ];

  const forYouData = [
    { id: 'h1', image: images.h1 },
    { id: 'h2', image: images.h2 },
    { id: 'h3', image: images.h3 },
    { id: 'h4', image: images.h4 },
    { id: 'h5', image: images.h5 },
    { id: 'h6', image: images.h6 },
  ];

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
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

          <ScrollView showsVerticalScrollIndicator={false}>
            <SolidText style={styles.title}>
              {localization.appkeys.themes}
            </SolidText>

            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryList}
              contentContainerStyle={{ paddingHorizontal: 20, marginTop: 4 }}
            >
              {categories.map(cat => (
                <CategoryTab
                  key={cat.id}
                  title={cat.title}
                  isActive={activeCategory === cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  isCreate={cat.isCreate}
                />
              ))}
            </ScrollView>

            {/* Theme Mixes */}
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

            <FlatList
              horizontal
              data={themeMixesData}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              style={styles.mixesList}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              renderItem={({ item }) => (
                <HorizontalMixCard
                  image={item.image}
                  title={item.title}
                  onPress={() =>
                    navigation.navigate(AppRoutes.ThemeDetail as never, {
                      title: item.title,
                    } as never)
                  }
                />
              )}
            />

            {/* For You Grid */}
            <View style={[styles.sectionHeader, styles.contentPadding]}>
              <SolidText style={styles.sectionTitle}>
                {localization.appkeys.forYou}
              </SolidText>
            </View>

            <FlatList
              data={forYouData}
              keyExtractor={item => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={[
                styles.gridList,
                { paddingHorizontal: 14 },
              ]}
              style={{ marginTop: -4 }}
              renderItem={({ item }) => <GridThemeCard image={item.image} />}
            />
          </ScrollView>
          <GetCreditsModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};

export default ThemeMixes;
