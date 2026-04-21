import React, { createContext, useState, ReactNode, useEffect } from 'react';
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

  useEffect(() => {
    initializeAppLanguage();
  }, []);

  const setLanguage = (language: string) => {
    localization.setLanguage(language);
    setAppLanguage(language);
    AsyncStorage.setItem(strings.appLanguage, language);
  };

  const initializeAppLanguage = async () => {
    const currentLanguage = await AsyncStorage.getItem(strings.appLanguage);
    // AppUtils.showLog(currentLanguage ?? "Language not found");
    if (!currentLanguage) {
      let localeCode = DEFAULT_LANGUAGE;
      const supportedLocaleCodes = localization.getAvailableLanguages();
      const phoneLocaleCodes = RNLocalize.getLocales().map(
        locale => locale.languageCode,
      );
      phoneLocaleCodes.some(code => {
        if (supportedLocaleCodes.includes(code)) {
          localeCode = code;
          return true;
        }
      });
      AppUtils.showLog(localeCode);
      setLanguage(localeCode);
    } else {
      AppUtils.showLog(currentLanguage);
      setLanguage(currentLanguage);
    }
  };

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
