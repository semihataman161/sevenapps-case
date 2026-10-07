import { createSettingsStore } from '@/stores/settingsStore';
import { INITIAL_SETTINGS_STATE } from '@/stores/settingsStore/constants';

const values = new Map<string, string>();

const useSettingsStore = createSettingsStore({
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => void values.set(key, value),
  removeItem: (key) => void values.delete(key),
});

const saved = (theme: string) => JSON.stringify({ state: { theme, language: 'tr' }, version: 1 });

async function rehydrate() {
  await useSettingsStore.persist.rehydrate();
}

describe('createSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState(INITIAL_SETTINGS_STATE);
    values.clear();
  });

  it('restores saved settings', async () => {
    values.set('video-diary/settings', saved('dark'));
    await rehydrate();
    expect(useSettingsStore.getState()).toMatchObject({ theme: 'dark', language: 'tr' });
  });

  it('starts with system defaults', async () => {
    await rehydrate();
    expect(useSettingsStore.getState()).toMatchObject({ theme: 'system', language: 'system' });
  });

  it('persists changes under its storage key', async () => {
    await rehydrate();
    useSettingsStore.getState().setTheme('dark');
    expect(JSON.parse(values.get('video-diary/settings') ?? '{}').state.theme).toBe('dark');
  });
});
