import React, { useContext, useState } from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import GetCreditsModal from '../../../../modals/GetCreditsModal';

const ThemeDetail = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const route = useRoute() as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  // Title passed from navigation params, fallback to 'Abstract' if missing
  const { title } = route.params || { title: 'Abstract' };

  // Theme items data based on hl1-hl6 assets
  const themeItemsData = [
    { id: '1', image: images.hl1 },
    { id: '2', image: images.hl2 },
    { id: '3', image: images.hl3 },
    { id: '4', image: images.hl2 },
    { id: '5', image: images.hl5 },
    { id: '6', image: images.hl6 },
    { id: '7', image: images.hl1 }, // Repeating for grid filling
    { id: '8', image: images.hl2 },
    { id: '9', image: images.hl3 },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => {
        setShowCreditsModal(true);
      }}
    >
      <ImageBackground
        source={item.image}
        style={styles.card}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        {/* <View style={styles.lockWrapper}>
        <Image
          source={images.simpleLock}
          style={styles.lockIcon}
          resizeMode="contain"
        />
      </View> */}
        {/* <SolidText style={styles.healText}>Heal</SolidText> */}
      </ImageBackground>
    </Pressable>
  );

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.container}>
          <View style={{ paddingHorizontal: 18 }}>
            <HeaderCommon title={title} />
          </View>

          <FlatList
            data={themeItemsData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={3}
            style={{ width: '100%', marginLeft: -8, marginTop: -10 }}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
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

export default ThemeDetail;
