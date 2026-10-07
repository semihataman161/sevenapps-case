import { createSettingsStore } from '@/stores/settingsStore';
import { SETTINGS_STORAGE_KEY } from '@/stores/settingsStore/constants';

function makeStore(saved?: object) {
  const values = new Map<string, string>();
  if (saved) values.set(SETTINGS_STORAGE_KEY, JSON.stringify({ state: saved, version: 1 }));
  const store = createSettingsStore({
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
    removeItem: (key) => void values.delete(key),
  });
  return { store, values };
}

describe('settingsStore', () => {
  it('starts with the system theme and language', () => {
    const { store } = makeStore();

    expect(store.getState()).toMatchObject({ theme: 'system', language: 'system' });
  });

  it('restores saved settings', () => {
    const { store } = makeStore({ theme: 'dark', language: 'tr' });

    expect(store.getState()).toMatchObject({ theme: 'dark', language: 'tr' });
  });

  it('saves only the preferences under its storage key', () => {
    const { store, values } = makeStore();

    store.getState().setTheme('dark');

    expect(JSON.parse(values.get(SETTINGS_STORAGE_KEY) ?? '{}')).toEqual({
      state: { theme: 'dark', language: 'system' },
      version: 1,
    });
  });
});
