import { create } from 'zustand';

import { clampSegmentStart } from '@/lib';

import { INITIAL_CROP_DRAFT_STATE } from './constants';
import type { CropDraftStore } from './types';

export type * from './types';

export const useCropDraftStore = create<CropDraftStore>()((set) => ({
  ...INITIAL_CROP_DRAFT_STATE,
  setSource: (source) => set({ ...INITIAL_CROP_DRAFT_STATE, source }),
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
  reset: () => set(INITIAL_CROP_DRAFT_STATE),
}));
