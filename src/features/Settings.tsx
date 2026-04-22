import React from 'react';
import { View } from 'react-native';
import SolidView from '../components/SolidView';
import SolidText from '../components/SolidText';

const Settings = () => {
  return (
    <SolidView
      view={
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <SolidText style={{ fontSize: 24 }}>Settings Screen</SolidText>
        </View>
      }
    />
  );
};

export default Settings;
