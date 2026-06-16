import React, { useContext, useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import SolidText from '../components/SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { LocalizationContext } from '../localization/localization';
import SolidBtn from '../components/SolidBtn';
import { triggerHaptic } from '../hooks/useHaptic';
import { useSubscription } from '../hooks/useSubscription';
import usePostApi from '../hooks/usePostApi';
import { endpoints } from '../api/Services/endpoints';
import { getUserDetail } from '../redux/Reducers/userData';
import { CREDIT_PACK_MAPPINGS } from '../config/purchasesConfig';

interface GetCreditsModalProps {
  visible: boolean;
  onClose: () => void;
}

const GetCreditsModal = ({ visible, onClose }: GetCreditsModalProps) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = useStyles(colors);
  const dispatch = useDispatch();

  const { purchasePackage } = useSubscription();
  const { mutate: syncPurchaseApi } = usePostApi();

  const [rcPackages, setRcPackages] = useState<PurchasesPackage[]>([]);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('large');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  // Fetch credits offering when modal becomes visible
  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        setIsLoadingOfferings(true);
        const offerings = await Purchases.getOfferings();
        const creditsOffering = offerings.all['credits_offering'];
        if (creditsOffering && creditsOffering.availablePackages) {
          const order = ['large_pack', 'medium_pack', 'small_pack'];
          const sorted = [...creditsOffering.availablePackages].sort((a, b) => {
            const indexA = order.indexOf(a.product.identifier);
            const indexB = order.indexOf(b.product.identifier);
            return (indexA > -1 ? indexA : 99) - (indexB > -1 ? indexB : 99);
          });
          setRcPackages(sorted);
        } else {
          console.warn('[RevenueCat] credits_offering not found in offerings.');
        }
      } catch (error) {
        console.error('[RevenueCat] Error fetching offerings:', error);
      } finally {
        setIsLoadingOfferings(false);
      }
    };

    if (visible) {
      fetchOfferings();
    }
  }, [visible]);

  const getPackDetails = (productIdentifier: string) => {
    switch (productIdentifier) {
      case 'large_pack':
        return {
          id: 'large',
          title: localization.appkeys.largePack,
          credits: '500x',
          badge: localization.appkeys.bestValue,
          type: localization.appkeys.oneTime,
        };
      case 'medium_pack':
        return {
          id: 'medium',
          title: localization.appkeys.mediumPack,
          credits: '300x',
          badge: localization.appkeys.mostPopular,
          type: localization.appkeys.oneTime,
        };
      case 'small_pack':
      default:
        return {
          id: 'small',
          title: localization.appkeys.smallPack,
          credits: '150x',
          badge: null,
          type: localization.appkeys.oneTime,
        };
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    if (purchasingId) return;

    triggerHaptic('impactMedium');
    const productId = pkg.product.identifier;
    setPurchasingId(productId);

    try {
      const result = await purchasePackage(pkg);
      if (result) {
        const { productIdentifier } = result;

        // Call backend API to increment user's credit balance
        syncPurchaseApi(
          {
            endpoint: endpoints.sync_purchase,
            data: {
              product_id: productIdentifier,
              credits: CREDIT_PACK_MAPPINGS[productIdentifier] || 0,
            },
          },
          {
            onSuccess: () => {
              // Refresh local credit balance state/UI
              dispatch(getUserDetail() as any);
              // Show a success toast/message
              AppUtils.showToast(
                localization.appkeys.purchaseSuccess || 'Purchase successful! Credits added.'
              );
              // Close modal
              onClose();
            },
            onError: (err: any) => {
              console.error('[Supabase] Failed to sync credits:', err);
              AppUtils.showToast(err?.message || 'Failed to update credit balance');
            },
          }
        );
      }
    } catch (error: any) {
      if (error?.userCancelled) {
        console.log('[RevenueCat] User cancelled credit purchase.');
      } else {
        console.error('[RevenueCat] Credit purchase failed:', error);
        AppUtils.showToast(error?.message || 'Purchase failed');
      }
    } finally {
      setPurchasingId(null);
    }
  };

  const displayPacks =
    rcPackages.length > 0
      ? rcPackages.map(pkg => {
          const details = getPackDetails(pkg.product.identifier);
          return {
            ...details,
            productIdentifier: pkg.product.identifier,
            price: pkg.product.priceString,
            rawPackage: pkg,
          };
        })
      : [
          {
            id: 'large',
            productIdentifier: 'large_pack',
            title: localization.appkeys.largePack,
            credits: '500x',
            price: '$9.99',
            badge: localization.appkeys.bestValue,
            type: localization.appkeys.oneTime,
            rawPackage: null,
          },
          {
            id: 'medium',
            productIdentifier: 'medium_pack',
            title: localization.appkeys.mediumPack,
            credits: '300x',
            price: '$5.99',
            badge: localization.appkeys.mostPopular,
            type: localization.appkeys.oneTime,
            rawPackage: null,
          },
          {
            id: 'small',
            productIdentifier: 'small_pack',
            title: localization.appkeys.smallPack,
            credits: '150x',
            price: '$2.99',
            badge: null,
            type: localization.appkeys.oneTime,
            rawPackage: null,
          },
        ];

  const handleGetCreditsBtnPress = () => {
    const selectedPack = displayPacks.find(p => p.id === selectedPackageId);
    if (selectedPack?.rawPackage) {
      handlePurchase(selectedPack.rawPackage);
    } else {
      AppUtils.showToast('Please wait or try again later');
    }
  };

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
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={(...args: any) => {
              return (onClose as any)(...args);
            }}
          >
            <Image
              source={images.cross2}
              style={styles.closeIcon}
              resizeMode="contain"
              tintColor={colors.brown}
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
            {isLoadingOfferings && rcPackages.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#604033" />
              </View>
            ) : (
              <View style={styles.packList}>
                {displayPacks.map(pack => {
                  const isPurchasingThisPack = purchasingId === pack.productIdentifier;
                  const isSelected = selectedPackageId === pack.id;

                  return (
                    <TouchableOpacity
                      key={pack.id}
                      style={[
                        styles.packCard,
                        isSelected && styles.packCardSelected,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => {
                        triggerHaptic('impactMedium');
                        setSelectedPackageId(pack.id);
                      }}
                      disabled={!!purchasingId}
                    >
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
                          {isPurchasingThisPack ? (
                            <ActivityIndicator
                              size="small"
                              color="#604033"
                              style={{ marginVertical: 6 }}
                            />
                          ) : (
                            <>
                              <SolidText style={styles.priceText}>
                                {pack.price}
                              </SolidText>
                              <SolidText style={styles.oneTimeText}>
                                {pack.type}
                              </SolidText>
                            </>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Action Buttons */}
            <SolidBtn
              btnStyle={styles.mainBtn}
              titleTxt={localization.appkeys.getCredits}
              isLoading={!!purchasingId}
              disabled={!!purchasingId || rcPackages.length === 0}
              onPress={handleGetCreditsBtnPress}
            />

            <SolidBtn
              btnStyle={styles.secondaryBtn}
              txtStyle={styles.secondaryBtnText}
              titleTxt={localization.appkeys.maybeLater}
              disabled={!!purchasingId}
              onPress={(...args: any) => {
                return (onClose as any)(...args);
              }}
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
      marginBottom: Platform.OS === 'ios' ? 30 : 20,
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
    packCardSelected: {
      borderColor: '#3A2110',
      borderWidth: 2.5,
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
    loadingContainer: {
      marginVertical: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default GetCreditsModal;
