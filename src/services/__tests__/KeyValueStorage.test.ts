import { KeyValueStorage } from '@/services/KeyValueStorage';

describe('KeyValueStorage', () => {
  it('reads, writes and removes values through its backend', () => {
    const values = new Map<string, string>();
    const storage = new KeyValueStorage({
      getItemSync: (key) => values.get(key) ?? null,
      setItemSync: (key, value) => void values.set(key, value),
      removeItemSync: (key) => values.delete(key),
    });

    storage.setItem('theme', 'dark');
    expect(storage.getItem('theme')).toBe('dark');
    storage.removeItem('theme');
    expect(storage.getItem('theme')).toBeNull();
  });
});
