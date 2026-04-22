import React from 'react';
import { View } from 'react-native';
import SolidView from '../../components/SolidView';
import SolidText from '../../components/SolidText';

const Modules = () => {
  return (
    <SolidView
      view={
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <SolidText style={{ fontSize: 24 }}>Modules Screen</SolidText>
        </View>
      }
    />
  );
};

export default Modules;
