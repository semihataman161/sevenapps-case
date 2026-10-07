import type { SettingsState } from './types';

export const INITIAL_SETTINGS_STATE: SettingsState = {
  theme: 'system',
  language: 'system',
};

export const SETTINGS_STORAGE_KEY = 'video-diary/settings';

export const SETTINGS_STORAGE_VERSION = 1;
