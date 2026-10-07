import { create } from 'zustand';

import { videoService, type VideoRecord } from '@/services';

import { INITIAL_VIDEO_STATE, PAGE_SIZE } from './constants';
import type { VideoStore } from './types';

export type * from './types';

function indexById(videos: VideoRecord[]): Record<string, VideoRecord> {
  return Object.fromEntries(videos.map((video) => [video.id, video]));
}

export const useVideoStore = create<VideoStore>()((set, get) => ({
  ...INITIAL_VIDEO_STATE,

  hydrate: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const [page, total] = await Promise.all([
        videoService.listPage({ limit: PAGE_SIZE }),
        videoService.count(),
      ]);
      set({
        status: 'ready',
        ids: page.videos.map((video) => video.id),
        byId: indexById(page.videos),
        total,
        nextCursor: page.nextCursor,
      });
    } catch (error) {
      console.warn('Could not load videos', error);
      set({ status: 'error' });
    }
  },

  loadMore: async () => {
    const { status, nextCursor, isLoadingMore } = get();
    if (status !== 'ready' || !nextCursor || isLoadingMore) return;
    set({ isLoadingMore: true });
    try {
      const page = await videoService.listPage({ limit: PAGE_SIZE, after: nextCursor });
      set((state) => ({
        ids: [
          ...state.ids,
          ...page.videos.map((video) => video.id).filter((id) => !state.byId[id]),
        ],
        byId: { ...state.byId, ...indexById(page.videos) },
        nextCursor: page.nextCursor,
      }));
    } catch (error) {
      console.warn('Could not load more videos', error);
    } finally {
      set({ isLoadingMore: false });
    }
  },

  add: (video) =>
    set((state) => ({
      ids: [video.id, ...state.ids.filter((id) => id !== video.id)],
      byId: { ...state.byId, [video.id]: video },
      total: state.byId[video.id] ? state.total : state.total + 1,
    })),

  updateDetails: (id, details, updatedAt) =>
    set((state) => {
      const current = state.byId[id];
      if (!current) return state;
      return { byId: { ...state.byId, [id]: { ...current, ...details, updatedAt } } };
    }),

  remove: (id) =>
    set((state) => {
      if (!state.byId[id]) return state;
      const { [id]: _removed, ...byId } = state.byId;
      return { ids: state.ids.filter((v) => v !== id), byId, total: state.total - 1 };
    }),
}));

export const useVideo = (id: string | undefined) =>
  useVideoStore((state) => (id ? state.byId[id] : undefined));
