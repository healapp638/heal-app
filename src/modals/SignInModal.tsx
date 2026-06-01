import React, { useContext } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidText from '../components/SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { LocalizationContext } from '../localization/localization';
import useSocialLogin from '../hooks/useSocialLogin';
import { triggerHaptic } from '../hooks/useHaptic';
import AppRoutes from '../routes/RouteKeys/appRoutes';
import { wp } from '../utils/dimension';

interface SignInModalProps {
  visible: boolean;
  onClose: () => void;
}

const SignInModal = ({ visible, onClose }: SignInModalProps) => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = useStyles(colors);
  const { googleLogin, appleLogin, isSocialPending } = useSocialLogin();

  const renderFooterLinks = () => {
    const text = localization.appkeys?.signInAgreeText || '';
    const parts = text.split(/(\{terms\}|\{privacy\})/g);
    return parts.map((part: string, index: number) => {
      if (part === '{terms}') {
        return (
          <SolidText
            key={`terms-${index}`}
            style={styles.footerLink}
            onPress={() => {
              onClose();
              setTimeout(() => {
                navigation.navigate(AppRoutes.Terms as never);
              }, 300);
            }}
          >
            {localization.appkeys?.termsOfService}
          </SolidText>
        );
      }
      if (part === '{privacy}') {
        return (
          <SolidText
            key={`privacy-${index}`}
            style={styles.footerLink}
            onPress={() => {
              onClose();
              setTimeout(() => {
                navigation.navigate(AppRoutes.PrivacyPolicy as never);
              }, 300);
            }}
          >
            {localization.appkeys?.privacyPolicy}
          </SolidText>
        );
      }
      return part;
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <SolidText style={styles.title}>
              {localization.appkeys?.signIn || 'Sign In'}
            </SolidText>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={(...args: any) => {
                triggerHaptic('impactLight');
                return (onClose as any)(...args);
              }}
            >
              <Image
                source={images.cross2 || images.close}
                style={styles.closeIcon}
                resizeMode="contain"
                tintColor={colors.brown || '#3A2110'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.socialButtonsContainer}>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialBtn, styles.appleBtn]}
                onPress={(...args: any) => {
                  triggerHaptic('impactMedium');
                  onClose();
                  return (appleLogin as any)(...args);
                }}
                disabled={isSocialPending}
              >
                <Image
                  source={images.apple}
                  style={styles.socialIcon}
                  resizeMode="contain"
                  tintColor={colors.white}
                />
                <SolidText maxFontScale={1} style={styles.appleBtnTxt}>
                  {localization.appkeys?.signInWithApple}
                </SolidText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={(...args: any) => {
                triggerHaptic('impactMedium');
                onClose();
                return (googleLogin as any)(...args);
              }}
              disabled={isSocialPending}
            >
              <Image
                source={images.google2}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <SolidText maxFontScale={1} style={styles.socialBtnTxt}>
                {localization.appkeys?.signInWithGoogle}
              </SolidText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => {
                triggerHaptic('impactMedium');
                onClose();
                setTimeout(() => {
                  navigation.navigate(AppRoutes.EmailSignIn as never);
                }, 300);
              }}
            >
              <Image
                source={images.mail}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <SolidText maxFontScale={1} style={styles.socialBtnTxt}>
                {localization.appkeys?.continueWithEmail ||
                  'Continue with Email'}
              </SolidText>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <SolidText style={styles.footerText}>
              {renderFooterLinks()}
            </SolidText>
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
      backgroundColor: 'rgba(0,0,0,0.01)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: '#F7F4EB', // Typical off-white color in Heal app, fallback to F7F4EB
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,

      paddingBottom: Platform.OS === 'ios' ? 40 : 20,
      paddingTop: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      paddingHorizontal: 24,
    },
    headerSpacer: {
      width: 24, // same as closeBtn to keep title centered
    },
    title: {
      fontSize: AppUtils.fontSize(22),
      fontFamily: AppFonts.semiBold,
      color: colors.brown || '#3A2110',
      textAlign: 'center',
      includeFontPadding: false,
    },
    closeBtn: {},
    closeIcon: {
      width: 14,
      height: 14,
      tintColor: colors.brown,
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(58, 33, 16, 0.1)', // Light brown divider

      marginBottom: 34,
      marginTop: 10,
    },
    socialButtonsContainer: {
      width: '100%',
      paddingHorizontal: 24,
    },
    socialBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      height: Platform.OS === 'ios' ? 52 : 50,
      borderRadius: 100,
      width: '90%',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: 'rgba(58, 33, 16, 0.2)', // Border color
      alignSelf: 'center',
    },
    appleBtn: {
      backgroundColor: '#000000',
      borderWidth: 0,
    },
    socialIcon: {
      width: 22,
      height: 22,
      marginRight: 10,
    },
    socialBtnTxt: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(15),
      color: colors.brown || '#3A2110',
      includeFontPadding: false,
    },
    appleBtnTxt: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(15),
      color: colors.white,
      includeFontPadding: false,
    },
    footer: {
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    footerText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(13),
      color: colors.brown || '#3A2110',
      textAlign: 'center',
      lineHeight: 20,
    },
    footerLink: {
      fontFamily: AppFonts.regular,
      textDecorationLine: 'underline',
      color: colors.brown || '#3A2110',
      fontSize: AppUtils.fontSize(12),
    },
  });

export default SignInModal;
