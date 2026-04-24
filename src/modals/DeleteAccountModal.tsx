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

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const DeleteAccountModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
}: DeleteAccountModalProps) => {
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

        <View style={styles.card} testID="deleteaccountmodal">
          <Image
            source={images.del}
            resizeMode="contain"
            style={styles.deleteIcon}
          />

          <SolidText style={styles.title}>
            {title || localization.appkeys?.deleteAccountTitle || 'Delete Account'}
          </SolidText>
          <SolidText style={styles.description}>
            {description ||
              localization.appkeys?.deleteAccountDescription ||
              'Are you sure you want to delete this Account?'}
          </SolidText>

          <SolidBtn
            titleTxt={
              confirmLabel || localization.appkeys?.deleteLabel || 'Delete'
            }
            onPress={handleConfirm}
            btnStyle={styles.primaryBtn}
          />
          <SolidBtn
            titleTxt={
              cancelLabel || localization.appkeys?.cancelLabel || 'Cancel'
            }
            onPress={onClose}
            btnStyle={styles.secondaryBtn}
            txtStyle={styles.secondaryBtnText}
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
      backgroundColor: 'rgba(0,0,0,0.38)',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 12,
      paddingHorizontal: 20,

      paddingBottom: 24, // Added a bit more padding since no footer
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
      alignItems: 'center',
    },
    deleteIcon: {
      width: 80,
      height: 80,
      marginTop: 26,
      marginBottom: 30,
    },
    title: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(24),
      color: '#1E1D21',
      includeFontPadding: false,
      textAlign: 'center',
      marginBottom: Platform.OS == 'ios' ? 8 : 4,
    },
    description: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      lineHeight: 24,
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
  });

export default memo(DeleteAccountModal);
