import React, { memo, useCallback } from 'react';
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
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from '../components/SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { triggerHaptic } from '../hooks/useHaptic';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
interface QuoteThemeModalProps {
  visible: boolean;
  onClose: () => void;
}
const QuoteThemeModal = ({ visible, onClose }: QuoteThemeModalProps) => {
  const { colors, images } = useTheme() as any;
  const styles = useStyles(colors);
  const themeOptions = [
    {
      id: 1,
      name: 'Minimal',
      color: '#F4EEE2',
    },
    {
      id: 2,
      name: 'Midnight',
      color: '#1E1D21',
    },
    {
      id: 3,
      name: 'Ocean',
      color: '#E0F2F1',
    },
    {
      id: 4,
      name: 'Sunset',
      color: '#FFF3E0',
    },
    {
      id: 5,
      name: 'Forest',
      color: '#E8F5E9',
    },
    {
      id: 6,
      name: 'Lavender',
      color: '#F3E5F5',
    },
  ];
  const renderThemeItem = ({ item }: any) => (
    <TouchableOpacity style={styles.themeItem}>
      <View
        style={[
          styles.colorCircle,
          {
            backgroundColor: item.color,
          },
        ]}
      />
      <SolidText style={styles.themeName}>{item.name}</SolidText>
    </TouchableOpacity>
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
        <TouchableWithoutFeedback
          onPress={(...args: any) => {
            triggerHaptic('impactMedium');
            return (onClose as any)(...args);
          }}
        >
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <SolidText style={styles.title}>Quote Theme</SolidText>
            <TouchableOpacity
              onPress={(...args: any) => {
                triggerHaptic('impactMedium');
                return (onClose as any)(...args);
              }}
            >
              <SolidText style={styles.doneBtn}>Done</SolidText>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <SolidText style={styles.sectionTitle}>BACKGROUNDS</SolidText>
            <FlatList
              data={themeOptions}
              renderItem={renderThemeItem}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>

          <View style={styles.section}>
            <SolidText style={styles.sectionTitle}>FONTS</SolidText>
            <View style={styles.fontRow}>
              <TouchableOpacity style={styles.fontItem}>
                <SolidText
                  style={[
                    styles.fontPreview,
                    {
                      fontFamily: AppFonts.reco,
                    },
                  ]}
                >
                  Aa
                </SolidText>
                <SolidText style={styles.fontName}>Reco</SolidText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fontItem}>
                <SolidText
                  style={[
                    styles.fontPreview,
                    {
                      fontFamily: AppFonts.medium,
                    },
                  ]}
                >
                  Aa
                </SolidText>
                <SolidText style={styles.fontName}>Medium</SolidText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fontItem}>
                <SolidText
                  style={[
                    styles.fontPreview,
                    {
                      fontFamily: AppFonts.regular,
                    },
                  ]}
                >
                  Aa
                </SolidText>
                <SolidText style={styles.fontName}>Regular</SolidText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.unlockAllBtn}>
              <SolidText style={styles.unlockAllTxt}>
                Unlock All Themes
              </SolidText>
            </TouchableOpacity>
          </View>
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
      backgroundColor: colors.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 12,
      paddingBottom: Platform.OS === 'ios' ? 40 : 20,
      minHeight: SCREEN_HEIGHT * 0.5,
    },
    dragHandle: {
      width: 40,
      height: 4,
      backgroundColor: '#D1CDCA',
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    title: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(20),
      color: '#3A2110',
    },
    doneBtn: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: '#3A2110',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(12),
      color: '#A08E83',
      paddingHorizontal: 24,
      marginBottom: 16,
      letterSpacing: 1,
    },
    listContent: {
      paddingHorizontal: 16,
    },
    themeItem: {
      alignItems: 'center',
      marginHorizontal: 8,
    },
    colorCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: '#D1CDCA',
      marginBottom: 8,
    },
    themeName: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#3A2110',
    },
    fontRow: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      justifyContent: 'space-between',
    },
    fontItem: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: '#F0EBE8',
    },
    fontPreview: {
      fontSize: AppUtils.fontSize(24),
      color: '#3A2110',
      marginBottom: 4,
    },
    fontName: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: '#3A2110',
    },
    footer: {
      paddingHorizontal: 24,
      marginTop: 'auto',
    },
    unlockAllBtn: {
      backgroundColor: '#3A2110',
      borderRadius: 100,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
    },
    unlockAllTxt: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(16),
      color: '#FFFFFF',
    },
  });
export default memo(QuoteThemeModal);
