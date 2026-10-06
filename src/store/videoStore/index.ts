import { create } from 'zustand';

import { videoRepository } from '@/db';

import type { VideoState } from './types';

export type * from './types';

export const useVideoStore = create<VideoState>()((set, get) => ({
  status: 'idle',
  error: null,
  ids: [],
  byId: {},

  hydrate: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading', error: null });
    try {
      const videos = await videoRepository.getAll();
      set({
        status: 'ready',
        ids: videos.map((v) => v.id),
        byId: Object.fromEntries(videos.map((v) => [v.id, v])),
      });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Could not load your videos.',
      });
    }
  },

  add: (video) =>
    set((state) => ({
      ids: [video.id, ...state.ids.filter((id) => id !== video.id)],
      byId: { ...state.byId, [video.id]: video },
    })),

  updateMetadata: (id, metadata, updatedAt) =>
    set((state) => {
      const current = state.byId[id];
      if (!current) return state;
      return { byId: { ...state.byId, [id]: { ...current, ...metadata, updatedAt } } };
    }),

  remove: (id) =>
    set((state) => {
      const { [id]: _removed, ...byId } = state.byId;
      return { ids: state.ids.filter((v) => v !== id), byId };
    }),
}));

export const useVideo = (id: string | undefined) =>
  useVideoStore((state) => (id ? state.byId[id] : undefined));
