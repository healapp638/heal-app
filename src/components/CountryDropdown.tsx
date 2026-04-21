import React, { useState, useMemo, useContext } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  Image,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import { COUNTRIES } from '../constants/countries';
import { LocalizationContext } from '../localization/localization';

interface CountryDropdownProps {
  label?: string;
  selectedCountry: { name: string; isoCode: string } | null;
  onSelect: (country: { name: string; isoCode: string }) => void;
  rightImg?: any;
  onInfoPress?: () => void;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  label,
  selectedCountry,
  onSelect,
  rightImg,
  onInfoPress,
}) => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const styles = style(colors);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.labelRow}>
        {label && <SolidText style={styles.label}>{label}</SolidText>}
        {onInfoPress && (
          <TouchableOpacity onPress={onInfoPress} style={styles.infoButton}>
            <Image
              source={images.info || images.other} // Fallback if info not available
              style={[styles.infoIcon, { tintColor: colors.primary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.dropdownHeader}
        activeOpacity={0.7}
        onPress={() => {
          setIsOpen(!isOpen);
          if (isOpen) Keyboard.dismiss();
        }}
      >
        <SolidText
          style={[
            styles.selectedText,
            { color: selectedCountry ? colors.brown : '#999' },
          ]}
        >
          {selectedCountry?.name ?? localization.appkeys?.selectOrSearchCountry}
        </SolidText>
        <Image
          source={!isOpen ? images.downArr : images.upArr} // Using back icon rotated or just a placeholder for chevron
          style={[styles.chevronIcon]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownContent}>
          <TextInput
            style={styles.searchInput}
            placeholder={localization.appkeys?.searchCountryPlaceholder}
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {filteredCountries.length === 0 ? (
              <View style={styles.emptyContainer}>
                <SolidText style={styles.emptyText}>
                  {localization.appkeys?.noCountriesFound}
                </SolidText>
              </View>
            ) : (
              filteredCountries.map(item => (
                <TouchableOpacity
                  key={item.isoCode}
                  onPress={() => {
                    onSelect(item);
                    setIsOpen(false);
                    setSearch('');
                    Keyboard.dismiss();
                  }}
                  style={[
                    styles.item,
                    item.name === selectedCountry?.name && styles.itemSelected,
                  ]}
                >
                  <SolidText
                    style={[
                      styles.itemText,
                      item.name === selectedCountry?.name &&
                        styles.itemTextSelected,
                    ]}
                  >
                    {item.name}
                  </SolidText>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      marginBottom: 20,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(13),
      color: colors.black,
      marginBottom: Platform.OS === 'ios' ? 8 : 4,
      marginLeft: 5,
      includeFontPadding: false,
    },
    infoButton: {
      marginLeft: 6,
      marginBottom: Platform.OS === 'ios' ? 8 : 4,
    },
    infoIcon: {
      width: 14,
      height: 14,
    },
    dropdownHeader: {
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      height: 54,
      borderRadius: 12,
      paddingHorizontal: 15,
    },
    selectedText: {
      flex: 1,
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(15),
      includeFontPadding: false,
    },
    chevronIcon: {
      width: 14,
      height: 14,
      tintColor: colors.primary,
    },
    dropdownContent: {
      backgroundColor: colors.white,
      borderRadius: 12,
      marginTop: 8,
      padding: 10,
      borderWidth: 1,
      borderColor: '#F0F0F0',
      maxHeight: hp('30%'),
    },
    searchInput: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.black,
      borderBottomWidth: 1,
      borderBottomColor: '#EEE',
      paddingVertical: 8,
      paddingHorizontal: 10,
      marginBottom: 6,
    },
    list: {
      flexGrow: 0,
    },
    item: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginVertical: 2,
    },
    itemSelected: {
      backgroundColor: colors.primary + '20', // Transparent primary
    },
    itemText: {
      fontFamily: AppFonts.regular,
      fontSize: AppUtils.fontSize(14),
      color: colors.black,
      includeFontPadding: false,
    },
    itemTextSelected: {
      fontFamily: AppFonts.medium,
      color: colors.primary,
      includeFontPadding: false,
    },
    emptyContainer: {
      padding: 16,
      alignItems: 'center',
    },
    emptyText: {
      color: '#999',
      fontSize: AppUtils.fontSize(14),
      includeFontPadding: false,
    },
  });

export default CountryDropdown;
