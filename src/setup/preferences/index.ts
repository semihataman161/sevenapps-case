import { colorScheme } from 'nativewind';
import { AppState } from 'react-native';

import { getDeviceLanguage, i18n, type AppLanguage } from '@/i18n';

import { useSettingsStore, type LanguagePreference, type ThemePreference } from '@/store';

export function resolveLanguage(preference: LanguagePreference): AppLanguage {
  return preference === 'system' ? getDeviceLanguage() : preference;
}

function applyTheme(theme: ThemePreference) {
  colorScheme.set(theme);
}

function applyLanguage(preference: LanguagePreference) {
  const language = resolveLanguage(preference);
  if (i18n.language !== language) i18n.changeLanguage(language);
}

let initialized = false;

export function initPreferences() {
  if (initialized) return;
  initialized = true;

  const { theme, language } = useSettingsStore.getState();
  applyTheme(theme);
  applyLanguage(language);

  useSettingsStore.subscribe((state, previous) => {
    if (state.theme !== previous.theme) applyTheme(state.theme);
    if (state.language !== previous.language) applyLanguage(state.language);
  });

  AppState.addEventListener('change', (status) => {
    if (status === 'active') applyLanguage(useSettingsStore.getState().language);
  });
}
