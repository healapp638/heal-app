import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import SolidText from '../components/SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  btnLabel?: string;
  onPressBtn?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  btnLabel = 'Login',
  onPressBtn,
}) => {
  const { colors, images } = useTheme() as any;
  const styles = style(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Image
            source={images.sucess}
            style={styles.successIcon}
            resizeMode="contain"
          />

          <SolidText style={styles.modalTitle}>{title}</SolidText>
          <SolidText style={styles.modalSubtitle}>{subtitle}</SolidText>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: colors.brown }]}
            onPress={onPressBtn || onClose}
          >
            <SolidText style={styles.modalButtonText}>{btnLabel}</SolidText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const style = (colors: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCard: {
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 20,
      width: '90%',
      alignItems: 'center',
    },
    successIcon: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    modalTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(22),
      color: colors.black,
      marginBottom: 12,
      textAlign: 'center',
      includeFontPadding: false,
      width: '80%',
    },
    modalSubtitle: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.black,
      textAlign: 'center',
      marginBottom: 30,
      lineHeight: 24,
      includeFontPadding: false,
      paddingHorizontal: 10,
    },
    modalButton: {
      borderRadius: 100,
      paddingVertical: 16,
      width: '100%',
      alignItems: 'center',
    },
    modalButtonText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(18),
      color: colors.white,
      includeFontPadding: false,
    },
  });

export default SuccessModal;
