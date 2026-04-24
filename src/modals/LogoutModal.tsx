import React, { memo, useCallback, useContext } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from '../components/SolidText';
import SolidBtn from '../components/SolidBtn';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { LocalizationContext } from '../localization/localization';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  footerLabel?: string;
}

const LogoutModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  footerLabel,
}: LogoutModalProps) => {
  const { colors, images } = useTheme() as any;
  const styles = useStyles(colors);
  const { localization } = useContext(LocalizationContext) as any;

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
      return;
    }
    onClose();
  }, [onClose, onConfirm]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.card} testID="logoutmodal">
          <Image
            source={images.logoutBig}
            resizeMode="contain"
            style={styles.logoutIcon}
          />

          <SolidText style={styles.title}>
            {title || localization.appkeys?.logoutTitle || 'Log Out?'}
          </SolidText>
          <SolidText style={styles.description}>
            {description ||
              localization.appkeys?.logoutDescription ||
              'Are you sure you want to log out? Your safe space will be here whenever you need it.'}
          </SolidText>

          <SolidBtn
            titleTxt={
              confirmLabel ||
              localization.appkeys?.logoutConfirm ||
              'Yes, Log Out'
            }
            onPress={handleConfirm}
            btnStyle={styles.primaryBtn}
          />
          <SolidBtn
            titleTxt={
              cancelLabel ||
              localization.appkeys?.logoutCancel ||
              'Stay Connected'
            }
            onPress={onClose}
            btnStyle={styles.secondaryBtn}
            txtStyle={styles.secondaryBtnText}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}
          >
            <SolidText style={styles.footerText}>
              {footerLabel ||
                localization.appkeys?.logoutFooter ||
                "We'll miss you, but take care"}
            </SolidText>
            <Image
              source={images.heart}
              resizeMode="contain"
              style={{ width: 12, height: 12, marginLeft: 2 }}
            />
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
      backgroundColor: 'rgba(0,0,0,0.38)',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
      alignItems: 'center',
    },
    logoutIcon: {
      width: 80,
      height: 80,
      marginBottom: 10,
    },
    title: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(24),

      color: '#1E1D21',
      includeFontPadding: false,
      textAlign: 'center',
      marginBottom: 12,
    },
    description: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      lineHeight: 26,
      color: '#1E1D21',
      includeFontPadding: false,
      textAlign: 'center',
      marginBottom: Platform.OS === 'ios' ? 26 : 22,
    },
    primaryBtn: {
      width: '100%',
      marginTop: 0,
      marginBottom: 12,
    },

    secondaryBtn: {
      width: '100%',
      marginTop: 0,
      marginBottom: 0,

      backgroundColor: '#D1CDCA',
    },
    secondaryBtnText: {
      color: '#5F4437',
      includeFontPadding: false,
    },
    footerText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(12),

      color: '#7B5849',
      includeFontPadding: false,
      textAlign: 'center',
    },
  });

export default memo(LogoutModal);
