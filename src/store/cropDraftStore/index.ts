import { create } from 'zustand';

import { clampSegmentStart } from '@/lib';

import type { CropDraftState } from './types';

export type * from './types';

export const useCropDraftStore = create<CropDraftState>()((set) => ({
  source: null,
  start: 0,
  setSource: (source) => set({ source, start: 0 }),
  setDuration: (duration) =>
    set((state) =>
      state.source && duration > 0
        ? {
            source: { ...state.source, duration },
            start: clampSegmentStart(state.start, duration),
          }
        : state,
    ),
  setStart: (start) =>
    set((state) => ({
      start: state.source ? clampSegmentStart(start, state.source.duration) : 0,
    })),
  reset: () => set({ source: null, start: 0 }),
}));
