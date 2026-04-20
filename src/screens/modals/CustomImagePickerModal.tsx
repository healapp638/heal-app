import React from 'react';
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import ImagePicker, { Image } from 'react-native-image-crop-picker'; // Assuming Image is imported from 'react-native-image-crop-picker'
import AppUtils from '../../utils/appUtils';

interface CustomImagePickerModalProps {
  visible: boolean;
  attachments: (image: Image) => void;
  pressHandler: () => void;
}

const CustomImagePickerModal: React.FC<CustomImagePickerModalProps> = ({
  visible,
  attachments,
  pressHandler,
}) => {
  const openGallery = () => {
    try {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: false,
        mediaType: "photo",
      }).then((image: Image) => {
        attachments(image);
        pressHandler();
      });
    } catch (error:any) {
      AppUtils.showToast(error?.message ?? "Error")
    }
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: false,
    }).then((image: Image) => {
      attachments(image);
      pressHandler();
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}>
      <Pressable onPress={pressHandler} style={styles.modalScreen}>
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Text style={styles.chooseMedia}>Choose Media</Text>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={openGallery}>
              <Text style={styles.options}>GALLERY</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openCamera}>
              <Text style={styles.options}>CAMERA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalScreen: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    height: '17%',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  chooseMedia: {
    fontSize: 16,
  },
  options: {
    fontSize: 16,
    color: '#2F6A98',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CustomImagePickerModal;