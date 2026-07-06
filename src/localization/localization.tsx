import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import * as RNLocalize from 'react-native-localize';
import LocalizedStrings from 'react-native-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppUtils from '../utils/appUtils';
import { strings } from '../constants/variables';

interface LocalizationProviderProps {
  children: ReactNode;
}

export const DEFAULT_LANGUAGE = strings.english;

const localization = new LocalizedStrings({
  English: require('./langFiles/en.json'),
  French: require('./langFiles/fr.json'),
  Spanish: require('./langFiles/es.json'),
  German: require('./langFiles/de.json'),
  Russian: require('./langFiles/ru.json'),
  Portuguese: require('./langFiles/pt.json'),
  Italian: require('./langFiles/it.json'),
});

const languageCodeMapping: Record<string, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  ru: 'Russian',
  pt: 'Portuguese',
  it: 'Italian',
};

const regionLanguageMapping: Record<string, string> = {
  US: 'English',
  GB: 'English',
  FR: 'French',
  ES: 'Spanish',
  DE: 'German',
  RU: 'Russian',
  PT: 'Portuguese',
  BR: 'Portuguese',
  IT: 'Italian',
};

type LocalizationContextType = {
  localization: typeof LocalizedStrings;
  setAppLanguage: (language: string) => void;
  appLanguage: string;
  initializeAppLanguage: () => void;
};

export const LocalizationContext = createContext<LocalizationContextType>({
  localization,
  setAppLanguage: () => {},
  appLanguage: DEFAULT_LANGUAGE,
  initializeAppLanguage: () => {},
});

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
}) => {
  const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);

  const setLanguage = useCallback((language: string, saveToStorage = true) => {
    localization.setLanguage(language);
    setAppLanguage(language);
    if (saveToStorage) {
      AsyncStorage.setItem(strings.appLanguage, language);
    }
  }, []);

  const initializeAppLanguage = useCallback(async () => {
    const currentLanguage = await AsyncStorage.getItem(strings.appLanguage);
    if (!currentLanguage) {
      let localeCode = DEFAULT_LANGUAGE;
      const supportedLocaleCodes = localization.getAvailableLanguages();

      // 1. Try checking the preferred phone language settings first
      const phoneLocaleCodes = RNLocalize.getLocales().map(
        locale => locale.languageCode.toLowerCase(),
      );

      const matchedCode = phoneLocaleCodes.find(code => {
        const mappedLang = languageCodeMapping[code];
        return mappedLang && supportedLocaleCodes.includes(mappedLang);
      });

      if (matchedCode) {
        localeCode = languageCodeMapping[matchedCode];
      } else {
        // 2. Fall back to device Region/country setting (e.g. country code "FR")
        const deviceCountry = RNLocalize.getCountry();
        const regionLang = deviceCountry ? regionLanguageMapping[deviceCountry.toUpperCase()] : undefined;

        if (regionLang && supportedLocaleCodes.includes(regionLang)) {
          localeCode = regionLang;
        }
      }

      AppUtils.showLog(`Auto-detected language: ${localeCode}`);
      setLanguage(localeCode, false);
    } else {
      AppUtils.showLog(`Using saved language: ${currentLanguage}`);
      setLanguage(currentLanguage, false);
    }
  }, [setLanguage]);

  useEffect(() => {
    initializeAppLanguage();
  }, [initializeAppLanguage]);

  return (
    <LocalizationContext.Provider
      value={{
        localization,
        setAppLanguage: setLanguage,
        appLanguage,
        initializeAppLanguage,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};
