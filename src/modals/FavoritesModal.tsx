import React, { memo, useContext } from 'react';
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
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from '../components/SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { LocalizationContext } from '../localization/localization';

import SolidBtn from '../components/SolidBtn';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FavoritesModalProps {
  visible: boolean;
  onClose: () => void;
}

const FavoritesModal = ({ visible, onClose }: FavoritesModalProps) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = useStyles(colors);

  const favQuotes = [
    {
      id: 1,
      text: 'My life is a constant blessing.',
      date: 'Wed, May 6, 2026',
    },
    {
      id: 2,
      text: 'I let go of what was and welcome what is.',
      date: 'Wed, May 6, 2026',
    },
    {
      id: 3,
      text: 'I am capable of creating a life that honors my values and well-being.',
      date: 'Wed, May 6, 2026',
    },
    {
      id: 4,
      text: "I am so proud of my strength to walk away from what doesn't deserve me.",
      date: 'Wed, May 6, 2026',
    },
    { id: 5, text: 'My story has power.', date: 'Wed, May 6, 2026' },
    {
      id: 6,
      text: 'I am enough. I did enough. I can let go.',
      date: 'Wed, May 6, 2026',
    },
  ];

  const renderFavItem = ({ item }: any) => (
    <View style={styles.card}>
      <SolidText style={styles.quoteText}>{item.text}</SolidText>
      <View style={styles.cardFooter}>
        <SolidText style={styles.dateText}>{item.date}</SolidText>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <Image
              source={images.heartFill}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
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
            />
          </View>

          <SolidBtn
            titleTxt="Show all in feed"
            onPress={() => {}}
            btnStyle={styles.feedBtn}
            txtStyle={styles.feedBtnTxt}
          />

          <FlatList
            data={favQuotes}
            renderItem={renderFavItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
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
