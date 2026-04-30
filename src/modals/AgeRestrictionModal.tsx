import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import SolidText from '../components/SolidText';
import SolidBtn from '../components/SolidBtn';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface AgeRestrictionModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonLabel?: string;
}

const AgeRestrictionModal: React.FC<AgeRestrictionModalProps> = ({
  visible,
  onClose,
  title,
  message,
  buttonLabel = 'Ok',
}) => {
  const { colors } = useTheme() as any;
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
          <SolidText maxFontScale={1} style={styles.modalTitle}>
            {title}
          </SolidText>

          <SolidText maxFontScale={1} style={styles.modalMessage}>
            {message}
          </SolidText>

          <SolidBtn
            titleTxt={buttonLabel}
            onPress={onClose}
            btnStyle={styles.modalButton}
          />
        </View>
      </View>
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

      textAlign: 'center',
      includeFontPadding: false,
    },
    modalMessage: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(16),
      color: colors.brown,
      textAlign: 'center',
      includeFontPadding: false,
      lineHeight: 22,
      marginVertical: 12,
      paddingHorizontal: 20,
    },
    modalButton: {
      width: '100%',
      marginTop: 16,
      marginBottom: 10,
    },
  });

export default AgeRestrictionModal;
