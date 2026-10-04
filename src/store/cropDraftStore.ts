import { create } from 'zustand';

import { clampSegmentStart } from '@/lib/time';
import type { SourceVideo } from '@/types/video';

type CropDraftState = {
  source: SourceVideo | null;
  start: number;
  setSource: (source: SourceVideo) => void;
  setDuration: (duration: number) => void;
  setStart: (start: number) => void;
  reset: () => void;
};

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
