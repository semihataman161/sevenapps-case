import type { StoreApi, UseBoundStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export function pickKeys<T extends object, K extends keyof T>(
  state: T,
  keys: readonly K[],
): Pick<T, K> {
  const picked = {} as Pick<T, K>;
  for (const key of keys) picked[key] = state[key];
  return picked;
}

export function usePick<T extends object, K extends keyof T>(
  store: UseBoundStore<StoreApi<T>>,
  keys: readonly K[],
): Pick<T, K> {
  return store(useShallow((state: T) => pickKeys(state, keys)));
}
