import type { AppLanguage } from '@/i18n';

export type ThemePreference = 'system' | 'light' | 'dark';

export type LanguagePreference = 'system' | AppLanguage;

export type SettingsState = {
  theme: ThemePreference;
  language: LanguagePreference;
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: LanguagePreference) => void;
};
