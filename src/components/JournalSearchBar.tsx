import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface JournalSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onCalendarPress?: () => void;
}

const JournalSearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onCalendarPress,
}: JournalSearchBarProps) => {
  const { colors, images } = useTheme() as any;

  return (
    <View style={styles.searchRow}>
      <View style={[styles.searchBox, { backgroundColor: '#E4D9D0' }]}>
        <Image
          source={images.search}
          style={[styles.searchIcon, { tintColor: colors.brown }]}
          resizeMode="contain"
        />
        <TextInput
          style={[styles.searchInput, { color: colors.brown }]}
          placeholder={placeholder}
          placeholderTextColor={colors.brown}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity
        style={styles.calendarBtn}
        onPress={onCalendarPress}
        activeOpacity={0.8}
      >
        <Image
          source={images.calendar}
          style={[styles.calendarIcon, { tintColor: colors.brown }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 24 : 20,
    marginBottom: 24,
  },
  searchBox: {
    flex: 1,
    height: Platform.OS === 'ios' ? 40 : 36,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: AppFonts.medium,
    fontSize: AppUtils.fontSize(12),
    padding: 0,
    includeFontPadding: false,
  },
  calendarBtn: {
    width: Platform.OS === 'ios' ? 40 : 36,
    height: Platform.OS === 'ios' ? 40 : 36,
    backgroundColor: '#E4D9D0',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    width: Platform.OS === 'ios' ? 18 : 16,
    height: Platform.OS === 'ios' ? 18 : 16,
  },
});

export default JournalSearchBar;
