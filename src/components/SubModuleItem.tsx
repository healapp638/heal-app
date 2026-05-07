import React from 'react';
import { View, TouchableOpacity, Image, Platform } from 'react-native';
import SolidText from './SolidText';

interface SubModuleItemProps {
  sub: any;
  colorSet: { text: string; border: string };
  isCompleted: boolean;
  onPress: () => void;
  images: any;
  colors: any;
  styles: any;
}

const SubModuleItem: React.FC<SubModuleItemProps> = ({
  sub,
  colorSet,
  isCompleted,
  onPress,
  images,
  colors,
  styles,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.itemCard}
      activeOpacity={isCompleted ? 1 : 0.8}
    >
      <View style={[styles.itemCircle, { borderColor: colorSet.border }]}>
        <SolidText style={[styles.circleText, { color: colorSet.text }]}>
          {`${sub.totalCompletedPhaseCount || 0}/${sub.totalPhaseCount || 0}`}
        </SolidText>
      </View>
      <SolidText style={styles.itemLabel}>{sub.title}</SolidText>
      <Image
        source={isCompleted ? images.tick2 : images.forward2}
        style={{
          height: isCompleted ? 24 : 14,
          width: isCompleted ? 24 : 14,
          marginLeft: 10,
        }}
        resizeMode="contain"
        tintColor={isCompleted ? undefined : colors.brown || '#333'}
      />
    </TouchableOpacity>
  );
};

export default React.memo(SubModuleItem);
