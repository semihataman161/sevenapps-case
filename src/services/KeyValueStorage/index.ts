import Storage from 'expo-sqlite/kv-store';

import type { KeyValueStore, SyncKeyValueBackend } from './types';

export type * from './types';

export class KeyValueStorage implements KeyValueStore {
  constructor(private readonly backend: SyncKeyValueBackend = Storage) {}

  getItem(key: string): string | null {
    return this.backend.getItemSync(key);
  }

  setItem(key: string, value: string): void {
    this.backend.setItemSync(key, value);
  }

  removeItem(key: string): void {
    this.backend.removeItemSync(key);
  }
}
