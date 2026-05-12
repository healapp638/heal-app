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
import { triggerHaptic } from '../hooks/useHaptic';
interface ResumeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onStartOver: () => void;
}
const ResumeModal = ({
  visible,
  onClose,
  onConfirm,
  onStartOver,
}: ResumeModalProps) => {
  const { colors, images } = useTheme() as any;
  const styles = useStyles(colors);
  const { localization } = useContext(LocalizationContext) as any;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback
          onPress={(...args: any) => {
            return (onClose as any)(...args);
          }}
        >
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.card}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logoIcon}
          />

          <SolidText style={styles.title}>
            {localization.appkeys?.continueOnboarding || 'Continue Onboarding?'}
          </SolidText>
          <SolidText style={styles.description}>
            {localization.appkeys?.resumeDescription ||
              'Your previous progress is saved. Would you like to continue from where you left off or start fresh?'}
          </SolidText>

          <SolidBtn
            titleTxt={localization.appkeys?.continue || 'Continue'}
            onPress={(...args: any) => {
              return (onConfirm as any)(...args);
            }}
            btnStyle={styles.primaryBtn}
          />
          <SolidBtn
            titleTxt={localization.appkeys?.startOver || 'Start Over'}
            onPress={(...args: any) => {
              return (onStartOver as any)(...args);
            }}
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
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 16,
      paddingHorizontal: 24,
      paddingTop: 30,
      paddingBottom: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    logoIcon: {
      width: 120,
      height: 60,
      marginBottom: 20,
    },
    title: {
      fontFamily: AppFonts.semiBold,
      fontSize: AppUtils.fontSize(22),
      color: colors.brown,
      textAlign: 'center',
      marginBottom: Platform.OS == 'ios' ? 12 : 4,
    },
    description: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(15),
      lineHeight: 26,
      color: colors.brown,
      textAlign: 'center',
      marginBottom: 30,
      opacity: 0.8,
    },
    primaryBtn: {
      width: '100%',
      marginTop: -10,
    },
    secondaryBtn: {
      width: '100%',
      backgroundColor: '#F3F3F3',
      marginTop: 0,
      marginBottom: 0,
    },
    secondaryBtnText: {
      color: colors.brown,
    },
  });
export default memo(ResumeModal);
