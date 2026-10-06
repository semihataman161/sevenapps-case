import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { FALLBACK_LANGUAGE, pickSupportedLanguage, type AppLanguage } from '../languages';
import { de, en, es, tr } from '../locales';

export function getDeviceLanguage(): AppLanguage {
  return pickSupportedLanguage(getLocales().map((locale) => locale.languageCode));
}

export const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
    de: { translation: de },
    es: { translation: es },
  },
  lng: getDeviceLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  initAsync: false,
  interpolation: { escapeValue: false },
});
