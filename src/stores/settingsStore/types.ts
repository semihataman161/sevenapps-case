import type { AppLanguage } from '@/i18n';

export type ThemePreference = 'system' | 'light' | 'dark';

export type LanguagePreference = 'system' | AppLanguage;

export type SettingsState = {
  theme: ThemePreference;
  language: LanguagePreference;
};

export type SettingsActions = {
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: LanguagePreference) => void;
};

export type SettingsStore = SettingsState & SettingsActions;
