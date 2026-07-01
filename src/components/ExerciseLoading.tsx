import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import SolidView from './SolidView';

interface ExerciseLoadingProps {
  colors: any;
  styles: any;
}

const ExerciseLoading = React.memo(({ colors, styles }: ExerciseLoadingProps) => {
  return (
    <SolidView
      view={
        <View
          style={[
            styles.mainContainer,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <ActivityIndicator size="large" color={colors.brown} />
        </View>
      }
    />
  );
});

export default ExerciseLoading;
