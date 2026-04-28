import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import SolidText from './SolidText';

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
      <TouchableOpacity onPress={onToggle}>
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
