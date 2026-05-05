import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidText from '../components/SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface JournalDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  entry: any;
  localization: any;
}

const JournalDetailsModal = ({
  visible,
  onClose,
  entry,
  localization,
}: JournalDetailsModalProps) => {
  const { colors, images } = useTheme() as any;
  const styles = useStyle(colors);
  if (!entry) return null;

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="fade"
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <TouchableWithoutFeedback>
          <View
            style={[styles.modalContent, { backgroundColor: colors.white }]}
          >
            {/* Header */}
            <View style={styles.header}>
              <SolidText style={[styles.modalTitle, { color: colors.brown }]}>
                {localization.appkeys?.journalDetails || 'Details'}
              </SolidText>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={onClose}
                style={styles.closeBtn}
              >
                <Image
                  source={images.cross}
                  style={styles.closeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <SolidText style={styles.dateText}>{entry.date}</SolidText>
                <View
                  style={[styles.tagPill, { backgroundColor: colors.brown }]}
                >
                  <SolidText style={styles.tagText}>{entry.tag}</SolidText>
                </View>
              </View>
              <SolidText style={styles.timeText}>{entry.time}</SolidText>
            </View>

            {/* Title */}
            <SolidText style={[styles.entryTitle, { color: colors.brown }]}>
              {entry.title}
            </SolidText>

            {/* Body Box */}
            <View style={styles.bodyBox}>
              <SolidText style={styles.bodyText}>{entry.body}</SolidText>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const useStyle = (colors: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: 20,
    },
    modalContent: {
      borderRadius: 16,
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      position: 'relative',
      marginTop: -4,
    },
    modalTitle: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(18),
      includeFontPadding: false,
    },
    closeBtn: {
      position: 'absolute',
      right: -4,

      justifyContent: 'center',
      alignItems: 'center',
    },
    closeIcon: {
      width: 22,
      height: 22,
    },
    infoBox: {
      backgroundColor: '#F3EFEA',
      borderRadius: 12,
      padding: 8,
      marginBottom: 10,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateText: {
      fontFamily: AppFonts.medium,
      fontSize: AppUtils.fontSize(16),
      color: '#4B382A',
    },
    timeText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: '#776151',
      includeFontPadding: false,
    },
    tagPill: {
      paddingHorizontal: 17,
      paddingVertical: 3,
      borderRadius: 12,
    },
    tagText: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(10),
      color: '#FFFFFF',
      includeFontPadding: false,
    },
    entryTitle: {
      fontFamily: AppFonts.recoMedium,
      fontSize: AppUtils.fontSize(18),
      marginBottom: 8,
      marginLeft: 10,
      marginTop: 10,
    },
    bodyBox: {
      backgroundColor: '#FCF7F3',
      borderRadius: 12,
      padding: 8,
      marginBottom: 8,
    },
    bodyText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(12),
      color: colors.brown,
      lineHeight: 22,
    },
  });

export default JournalDetailsModal;
