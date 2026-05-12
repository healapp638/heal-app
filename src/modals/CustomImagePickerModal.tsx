import React, { useContext } from 'react';
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagePicker, {
  Image as PickerImage,
} from 'react-native-image-crop-picker';
import AppUtils from '../utils/appUtils';
import { useNavigation, useTheme } from '@react-navigation/native';
import { hp, wp } from '../utils/dimension';
import AppFonts from '../constants/fonts';
import SolidText from '../components/SolidText';
import { LocalizationContext } from '../localization/localization';
import FastImage from '@d11/react-native-fast-image';
import { triggerHaptic } from '../hooks/useHaptic';
interface CustomImagePickerModalProps {
  visible: boolean;
  attachments: (image: PickerImage) => void;
  pressHandler: () => void;
}
const CustomImagePickerModal: React.FC<CustomImagePickerModalProps> = ({
  visible,
  attachments,
  pressHandler,
}) => {
  const { colors, images }: any = useTheme();
  const { localization }: any = useContext(LocalizationContext);
  const openGallery = () => {
    try {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: false,
        mediaType: 'photo',
      }).then((image: PickerImage) => {
        attachments(image);
        pressHandler();
      });
    } catch (error: any) {
      AppUtils.showToast(error?.message ?? 'Error');
    }
  };
  const openCamera = () => {
    try {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: false,
      }).then((image: PickerImage) => {
        attachments(image);
        pressHandler();
      });
    } catch (error: any) {
      AppUtils.showToast(error?.message ?? 'Error');
    }
  };
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <Pressable
        onPress={(...args: any) => {
          return (pressHandler as any)(...args);
        }}
        style={styles.modalScreen}
      >
        <Pressable
          onPress={() => {}}
          style={[
            styles.modalContainer,
            styles.shadow,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View
              style={{
                height: 26,
                width: 26,
              }}
            ></View>
            <SolidText
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              {localization.appkeys?.UploadPicture}
            </SolidText>
            <Pressable
              onPress={(...args: any) => {
                return (pressHandler as any)(...args);
              }}
            >
              <FastImage
                source={images.cross}
                style={{
                  height: 26,
                  width: 26,
                }}
                tintColor={'black'}
              />
            </Pressable>
          </View>

          <View style={styles.cardsRow}>
            <TouchableOpacity
              onPress={(...args: any) => {
                return (openCamera as any)(...args);
              }}
              activeOpacity={0.8}
              style={styles.cardWrap}
            >
              <Image source={images.camera} style={[styles.cardIcon, {}]} />
              <SolidText
                style={[
                  styles.cardLabel,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {localization.appkeys?.Camera}
              </SolidText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(...args: any) => {
                return (openGallery as any)(...args);
              }}
              activeOpacity={0.8}
              style={styles.cardWrap}
            >
              <Image source={images.gallery} style={styles.cardIcon as any} />
              <SolidText
                style={[
                  styles.cardLabel,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {localization.appkeys?.Gallary}
              </SolidText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalScreen: {
    backgroundColor: 'rgba(55, 54, 54, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 15,
    paddingBottom: 25,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: AppUtils.fontSize(18),
    fontFamily: AppFonts.semiBold,
    textAlign: 'center',
    alignSelf: 'center',
    paddingVertical: 5,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 40,
  },
  cardWrap: {
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: wp(17),
    height: wp(17),
    resizeMode: 'contain',
  },
  cardLabel: {
    marginTop: 12,
    fontSize: AppUtils.fontSize(14),
    fontFamily: AppFonts.medium,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
export default CustomImagePickerModal;
