import React, { useContext } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from '../components/SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { LocalizationContext } from '../localization/localization';
import SolidBtn from '../components/SolidBtn';

interface GetCreditsModalProps {
  visible: boolean;
  onClose: () => void;
}

const GetCreditsModal = ({ visible, onClose }: GetCreditsModalProps) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = useStyles(colors);
  const packs = [
    {
      id: 'large',
      title: localization.appkeys.largePack,
      credits: '500x',
      price: '$12.99',
      badge: localization.appkeys.bestValue,
      type: localization.appkeys.oneTime,
    },
    {
      id: 'medium',
      title: localization.appkeys.mediumPack,
      credits: '300x',
      price: '$6.99',
      badge: localization.appkeys.mostPopular,
      type: localization.appkeys.oneTime,
    },
    {
      id: 'small',
      title: localization.appkeys.smallPack,
      credits: '150x',
      price: '$2.99',
      badge: null,
      type: localization.appkeys.oneTime,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Image
              source={images.cross2}
              style={styles.closeIcon}
              resizeMode="contain"
              tintColor={'black'}
            />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Top Icon */}

            <Image
              source={images.bigCrown}
              style={styles.bigCrown}
              resizeMode="contain"
            />

            {/* Header */}
            <SolidText style={styles.title}>
              {localization.appkeys.getCredits}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys.creditsLimitMsg}
            </SolidText>

            <TouchableOpacity>
              <SolidText style={styles.topUpLink}>
                {localization.appkeys.topUpCredits}
              </SolidText>
            </TouchableOpacity>

            {/* Packs List */}
            <View style={styles.packList}>
              {packs.map(pack => (
                <View key={pack.id} style={styles.packCard}>
                  {pack.badge && (
                    <View style={styles.badge}>
                      <SolidText style={styles.badgeText}>
                        {pack.badge}
                      </SolidText>
                    </View>
                  )}
                  <View style={styles.packHeader}>
                    <View>
                      <SolidText style={styles.packTitle}>
                        {pack.title}
                      </SolidText>
                      <View style={styles.creditsRow}>
                        <SolidText style={styles.creditsCount}>
                          {pack.credits}
                        </SolidText>
                        <Image
                          source={images.money}
                          style={styles.moneyIcon}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                    <View style={styles.priceCol}>
                      <SolidText style={styles.priceText}>
                        {pack.price}
                      </SolidText>
                      <SolidText style={styles.oneTimeText}>
                        {pack.type}
                      </SolidText>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <SolidBtn
              btnStyle={styles.mainBtn}
              titleTxt={localization.appkeys.getCredits}
              onPress={() => {}}
            />

            <SolidBtn
              btnStyle={styles.secondaryBtn}
              txtStyle={styles.secondaryBtnText}
              titleTxt={localization.appkeys.maybeLater}
              onPress={onClose}
            />

            {/* Footer Text */}
            <SolidText style={styles.footerText}>
              {localization.appkeys.creditsAutoRenew}
              {'\n'}
              <SolidText style={styles.footerText}>
                {localization.appkeys.termsConditions}
              </SolidText>
            </SolidText>
          </ScrollView>
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
    container: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,

      paddingHorizontal: 24,
      maxHeight: '90%',
    },
    closeBtn: {
      position: 'absolute',
      right: 14,
      top: 14,
      zIndex: 999,
    },
    closeIcon: {
      width: 14,
      height: 14,
    },
    scrollContent: {
      alignItems: 'center',
      paddingBottom: 40,
    },

    bigCrown: {
      width: 90,
      height: 90,
      marginTop: 8,
    },
    title: {
      fontSize: AppUtils.fontSize(26),
      fontFamily: AppFonts.recoMedium,
      color: '#3A2110',
      marginBottom: 6,
      textAlign: 'center',
      marginTop: -2,
    },
    subtitle: {
      fontSize: AppUtils.fontSize(15),
      fontFamily: AppFonts.regular,
      color: '#3A2110',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    topUpLink: {
      fontSize: AppUtils.fontSize(18),
      fontFamily: AppFonts.regular,
      color: colors.lightBrown,
      textDecorationLine: 'underline',
      marginBottom: Platform.OS == 'ios' ? 30 : 20,
    },
    packList: {
      width: '100%',
    },
    packCard: {
      width: '100%',
      borderRadius: 15,
      borderWidth: 1.5,
      borderColor: '#604033',
      padding: 16,
      marginBottom: 22,
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: -12,
      left: 15,
      backgroundColor: '#604033',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 10,
    },
    badgeText: {
      color: 'white',
      fontSize: AppUtils.fontSize(10),
      fontFamily: AppFonts.semiBold,
      textTransform: 'capitalize',
    },
    packHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    packTitle: {
      fontSize: AppUtils.fontSize(18),
      fontFamily: AppFonts.semiBold,
      color: '#604033',
      marginBottom: 6,
    },
    creditsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    creditsCount: {
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.regular,
      color: '#3A2110',
      marginRight: 4,
    },
    moneyIcon: {
      width: 22,
      height: 22,
    },
    priceCol: {
      alignItems: 'flex-end',
    },
    priceText: {
      fontSize: AppUtils.fontSize(24),
      fontFamily: AppFonts.bold,
      color: '#604033',
      marginTop: -6,
      marginBottom: Platform.OS === 'ios' ? 6 : 0,
    },
    oneTimeText: {
      fontSize: AppUtils.fontSize(11),
      fontFamily: AppFonts.medium,
      color: '#604033',
    },
    mainBtn: {
      width: '100%',
      marginTop: 10,
    },
    mainBtnText: {
      color: 'white',
      fontSize: AppUtils.fontSize(18),
      fontFamily: AppFonts.semiBold,
    },
    secondaryBtn: {
      width: '100%',
      backgroundColor: '#3A211033',
      marginBottom: 20,
      borderWidth: 1.5,
      borderColor: colors.brown,
      marginTop: 10,
    },
    secondaryBtnText: {
      color: colors.brown,
      fontSize: AppUtils.fontSize(18),
      fontFamily: AppFonts.semiBold,
    },
    footerText: {
      fontSize: AppUtils.fontSize(12),
      fontFamily: AppFonts.regular,
      color: '#3A2110',
      textAlign: 'center',
      lineHeight: 18,
      opacity: 0.8,
    },
    footerLink: {
      textDecorationLine: 'underline',
    },
  });

export default GetCreditsModal;
