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

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  requirements?: string[];
  buttonLabel?: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  onClose,
  title,
  message,
  requirements,
  buttonLabel = 'Ok',
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
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalCard}>
          <SolidText style={styles.modalTitle}>{title}</SolidText>

          {message && (
            <SolidText style={styles.modalMessage}>{message}</SolidText>
          )}

          {requirements && (
            <View style={styles.requirementsContainer}>
              {requirements.map((req, index) => (
                <View key={index} style={styles.requirementRow}>
                  <View
                    style={[styles.bullet, { backgroundColor: colors.black }]}
                  />
                  <SolidText style={styles.requirementText}>{req}</SolidText>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: colors.brown }]}
            onPress={onClose}
          >
            <SolidText style={styles.modalButtonText}>{buttonLabel}</SolidText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const style = (colors: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: wp('8%'),
    },
    modalCard: {
      backgroundColor: colors.white,
      borderRadius: 14,
      padding: 14,
      width: '100%',
      alignItems: 'center',
    },
    modalTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(22),
      color: colors.brown,
      marginBottom: 14,
      textAlign: 'center',
    },
    modalMessage: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.black,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 26,
    },
    requirementsContainer: {
      width: '100%',
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    requirementRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 10,
    },
    requirementText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(13),
      color: colors.black,
      flex: 1,
    },
    modalButton: {
      borderRadius: 100,
      paddingVertical: 14,
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 14,
    },
    modalButtonText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      color: colors.white,
    },
  });

export default InfoModal;
