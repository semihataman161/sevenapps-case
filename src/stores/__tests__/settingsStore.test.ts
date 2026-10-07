import { useSettingsStore } from '@/stores/settingsStore';
import { INITIAL_SETTINGS_STATE } from '@/stores/settingsStore/constants';

const mockValues = new Map<string, string>();

jest.mock('@/services', () => ({
  keyValueStorage: {
    getItem: (key: string) => mockValues.get(key) ?? null,
    setItem: (key: string, value: string) => void mockValues.set(key, value),
    removeItem: (key: string) => void mockValues.delete(key),
  },
}));

const saved = (theme: string) => JSON.stringify({ state: { theme, language: 'tr' }, version: 1 });

async function rehydrate() {
  await useSettingsStore.persist.rehydrate();
}

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState(INITIAL_SETTINGS_STATE);
    mockValues.clear();
  });

  it('restores saved settings', async () => {
    mockValues.set('video-diary/settings', saved('dark'));
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
    expect(JSON.parse(mockValues.get('video-diary/settings') ?? '{}').state.theme).toBe('dark');
  });
});
