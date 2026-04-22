import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  RefreshControlProps,
  Platform,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import AppRoutes from '../routes/RouteKeys/appRoutes';

interface SolidViewProps {
  viewStyle?: ViewStyle;
  mainContStyle?: ViewStyle;
  scrollContStyle?: ViewStyle;
  isScrollEnabled?: boolean;
  view: React.ReactNode;
  keyboardOffset?: number;
  isChatScreen?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  showChat?: boolean;
  keyboardVerticalOffset?: any;
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
  showChat = false,
  keyboardVerticalOffset,
}) => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const styles = style(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {isScrollEnabled ? (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          style={[{ flex: 1 }, mainContStyle]}
          contentContainerStyle={[styles.scrollContainer, scrollContStyle]}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
          bottomOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          {view}
        </KeyboardAwareScrollView>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={isChatScreen ? 'translate-with-padding' : 'padding'}
          keyboardVerticalOffset={
            keyboardVerticalOffset ?? Platform.OS === 'ios' ? 40 : 0
          }
          enabled={true}
        >
          {view}
        </KeyboardAvoidingView>
      )}

      {showChat && (
        <TouchableOpacity
          style={styles.healContainer}
          onPress={() => navigation.navigate(AppRoutes.HealyChat as never)}
        >
          <Image
            source={images.heal}
            style={styles.heal}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
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
    heal: {
      height: 70,
      width: 70,
    },
    healContainer: {
      position: 'absolute',
      zIndex: 9999,
      bottom: Platform.OS == 'ios' ? 114 : 94,
      right: 10,
    },
  });

export default SolidView;
