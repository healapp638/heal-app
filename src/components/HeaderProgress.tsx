import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

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
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity
          style={[styles.backButton]}
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactMedium', options);
            if (onBackPress) {
              onBackPress();
              return;
            }
            navigation.goBack();
          }}
        >
          <Image
            source={images.back}
            style={{
              width: 14,
              height: 14,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}
      <View
        style={[styles.progressBackground, { backgroundColor: colors.white }]}
      >
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
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
