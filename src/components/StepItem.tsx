import React from 'react';
import { View } from 'react-native';
import SolidText from './SolidText';

interface StepItemProps {
  item: any;
  index: number;
  styles: any;
  itemWidth: number;
}

const StepItem = React.memo(({ item, index, styles, itemWidth }: StepItemProps) => {
  return (
    <View style={{ width: itemWidth, justifyContent: 'center', alignItems: 'center' }}>
      <SolidText style={styles.numberText}>{index + 1}</SolidText>
      <SolidText style={styles.descriptionText}>
        {item.text}
      </SolidText>
    </View>
  );
});

export default StepItem;
