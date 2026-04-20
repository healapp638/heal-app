import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loader = () => {
  return (
    <View style={styles.modalScreen}>
      <ActivityIndicator size={'large'} color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  modalScreen: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 989,
  },
});

export default Loader;
