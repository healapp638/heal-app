import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  RefreshControlProps,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

interface SolidViewProps {
  viewStyle?: ViewStyle;
  mainContStyle?: ViewStyle;
  scrollContStyle?: ViewStyle;
  isScrollEnabled?: boolean;
  view: React.ReactNode;
  keyboardOffset?: number;
  isChatScreen?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

const SolidView: React.FC<SolidViewProps> = ({
  viewStyle,
  mainContStyle,
  scrollContStyle,
  view,
  isScrollEnabled = false,
  keyboardOffset = 0,
  isChatScreen = false,
  refreshControl,
}) => {
  const { colors, background } = useTheme() as any;
  const styles = style(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={isChatScreen ? 'translate-with-padding' : 'padding'}
        keyboardVerticalOffset={keyboardOffset}
      >
        {isScrollEnabled ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            style={[{ flex: 1 }, mainContStyle]}
            contentContainerStyle={[styles.scrollContainer, scrollContStyle]}
            keyboardShouldPersistTaps="handled"
            refreshControl={refreshControl}
          >
            {view}
          </ScrollView>
        ) : (
          view
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const style = (colors: any) =>
  StyleSheet.create({
    parent: {
      flex: 1,
      backgroundColor: colors.white,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContainer: {
      flexGrow: 1,
    },
  });

export default SolidView;
