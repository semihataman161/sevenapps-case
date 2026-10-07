import type { PageCursor, VideoDetails, VideoRecord } from '@/services';

export type HydrationStatus = 'idle' | 'loading' | 'ready' | 'error';

export type VideoState = {
  status: HydrationStatus;
  ids: string[];
  byId: Record<string, VideoRecord>;
  total: number;
  nextCursor: PageCursor | null;
  isLoadingMore: boolean;
  query: string;
  isSearching: boolean;
};

export type VideoActions = {
  hydrate: () => Promise<void>;
  loadMore: () => Promise<void>;
  load: (id: string) => Promise<VideoRecord | null>;
  search: (query: string) => Promise<void>;
  add: (video: VideoRecord) => void;
  updateDetails: (id: string, details: VideoDetails, updatedAt: number) => void;
  remove: (id: string) => void;
};

export type VideoStore = VideoState & VideoActions;
