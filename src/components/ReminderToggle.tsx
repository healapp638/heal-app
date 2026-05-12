import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import SolidText from './SolidText';
import { triggerHaptic } from '../hooks/useHaptic';
interface ReminderToggleProps {
  localization: any;
  styles: any;
  images: any;
  reminderEnabled: boolean;
  onToggle: () => void;
}
const ReminderToggle: React.FC<ReminderToggleProps> = ({
  localization,
  styles,
  images,
  reminderEnabled,
  onToggle,
}) => {
  return (
    <View style={styles.reminderRow}>
      <SolidText maxFontScale={1} style={styles.reminderText}>
        {localization.appkeys?.reminderBeforeEnds}
      </SolidText>
      <TouchableOpacity
        onPress={(...args: any) => {
          return (onToggle as any)(...args);
        }}
      >
        <Image
          source={reminderEnabled ? images.toggleOn : images.toggleOff}
          style={styles.toggleIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};
export default ReminderToggle;
