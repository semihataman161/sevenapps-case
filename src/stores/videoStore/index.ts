import { create } from 'zustand';

import type { VideoRecord } from '@/services';

import { INITIAL_VIDEO_STATE, PAGE_SIZE } from './constants';
import type { VideoState, VideoStore, VideoStoreService } from './types';

export type * from './types';

function indexById(videos: VideoRecord[]): Record<string, VideoRecord> {
  return Object.fromEntries(videos.map((video) => [video.id, video]));
}

function matches(video: VideoRecord, query: string): boolean {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return true;
  return `${video.name}\n${video.description}`.toLocaleLowerCase().includes(term);
}

export function createVideoStore(service: VideoStoreService) {
  return create<VideoStore>()((set, get) => ({
    ...INITIAL_VIDEO_STATE,

    hydrate: async () => {
      if (get().status === 'loading') return;
      set({ status: 'loading' });
      try {
        const [page, total] = await Promise.all([
          service.listPage({ limit: PAGE_SIZE, search: get().query }),
          service.count(),
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
      const { status, nextCursor, isLoadingMore, isSearching, query } = get();
      if (status !== 'ready' || !nextCursor || isLoadingMore || isSearching) return;
      set({ isLoadingMore: true });
      try {
        const page = await service.listPage({
          limit: PAGE_SIZE,
          after: nextCursor,
          search: query,
        });
        if (get().query !== query) return;
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

    load: async (id) => {
      const video = await service.get(id);
      if (video) set((state) => ({ byId: { ...state.byId, [id]: state.byId[id] ?? video } }));
      return video;
    },

    search: async (query) => {
      if (query === get().query) return;
      set({ query, isSearching: true });
      try {
        const page = await service.listPage({ limit: PAGE_SIZE, search: query });
        if (get().query !== query) return;
        set({
          ids: page.videos.map((video) => video.id),
          byId: indexById(page.videos),
          nextCursor: page.nextCursor,
        });
      } catch (error) {
        console.warn('Could not search videos', error);
      } finally {
        if (get().query === query) set({ isSearching: false });
      }
    },

    add: (video) =>
      set((state) => {
        const total = state.byId[video.id] ? state.total : state.total + 1;
        if (!matches(video, state.query)) return { total };
        return {
          ids: [video.id, ...state.ids.filter((id) => id !== video.id)],
          byId: { ...state.byId, [video.id]: video },
          total,
        };
      }),

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
}

export function selectVideo(id: string | undefined) {
  return (state: VideoState) => (id ? state.byId[id] : undefined);
}
