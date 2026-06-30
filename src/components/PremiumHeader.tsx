import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { triggerHaptic } from '../hooks/useHaptic';
import SolidText from './SolidText';
interface PremiumHeaderProps {
  showCloseBtn: boolean;
  onClose: () => void;
  styles: any;
  images: any;
  title?: string;
}
const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  showCloseBtn,
  onClose,
  styles,
  images,
  title,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        {showCloseBtn ? (
          <TouchableOpacity
            hitSlop={20}
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
      {!!title && (
        <View style={styles.headerTitleContainer}>
          <SolidText
            maxFontScale={1}
            style={[styles.title, styles.headerTitle]}
          >
            {title}
          </SolidText>
        </View>
      )}
      <View style={styles.headerRight} />
    </View>
  );
};
export default PremiumHeader;
