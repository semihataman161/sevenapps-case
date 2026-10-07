import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { keyValueStorage } from '@/services';

import {
  INITIAL_SETTINGS_STATE,
  SETTINGS_STORAGE_KEY,
  SETTINGS_STORAGE_VERSION,
} from './constants';
import type { SettingsStore } from './types';

export type * from './types';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...INITIAL_SETTINGS_STATE,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: SETTINGS_STORAGE_VERSION,
      storage: createJSONStorage(() => keyValueStorage),
      partialize: ({ theme, language }) => ({ theme, language }),
    },
  ),
);
