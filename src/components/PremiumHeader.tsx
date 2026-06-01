import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { triggerHaptic } from '../hooks/useHaptic';
interface PremiumHeaderProps {
  showCloseBtn: boolean;
  onClose: () => void;
  styles: any;
  images: any;
}
const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  showCloseBtn,
  onClose,
  styles,
  images,
}) => {
  return (
    <View>
      {showCloseBtn ? (
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={(...args: any) => {
            return (onClose as any)(...args);
          }}
        >
          <Image
            source={images.back}
            style={styles.closeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.closeBtnPlaceholder} />
      )}
    </View>
  );
};
export default PremiumHeader;
