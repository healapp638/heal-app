import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';

interface HeaderProgressProps {
  progress?: number; // 0 to 1
  showBack?: boolean;
  onBackPress?: () => void;
}

const HeaderProgress: React.FC<HeaderProgressProps> = ({
  progress = 0.5,
  showBack = true,
  onBackPress,
}) => {
  const { colors } = useTheme() as any;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.brown }]}
          onPress={() => {
            if (onBackPress) {
              onBackPress();
              return;
            }
            navigation.goBack();
          }}
        >
          <View
            style={[
              styles.backArrow,
              {
                borderLeftColor: colors.white,
                borderBottomColor: colors.white,
              },
            ]}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}
      <View style={[styles.progressBackground, { backgroundColor: colors.white }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: '#DF9D83', width: `${progress * 100}%` }, // Light peach/brown from screenshot
          ]}
        />
      </View>
      <View style={styles.rightPlaceholder} />
    </View>
  );
};

export default HeaderProgress;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 10 : 20,
    height: 44,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonPlaceholder: {
    width: 32, 
    marginRight: 10,
  },
  rightPlaceholder: {
    width: 0,
  },
  backArrow: {
    width: 8,
    height: 8,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }, { translateX: 1 }, { translateY: -1 }],
  },
  progressBackground: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
