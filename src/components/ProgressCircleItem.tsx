import React from 'react';
import { View } from 'react-native';
import SolidText from './SolidText';

interface ProgressCircleItemProps {
  step: number;
  isCompleted: boolean;
  isLast: boolean;
  styles: any;
}

const ProgressCircleItem = ({
  step,
  isCompleted,
  isLast,
  styles,
}: ProgressCircleItemProps) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.circleContainer}>
        <View style={isCompleted ? styles.circleActive : styles.circleInactive}>
          <SolidText
            style={
              isCompleted ? styles.circleTextActive : styles.circleTextInactive
            }
          >
            {step}
          </SolidText>
        </View>
      </View>
      {!isLast && (
        <View style={[styles.line, isCompleted && styles.lineActive]} />
      )}
    </View>
  );
};

export default React.memo(ProgressCircleItem);
