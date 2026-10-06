import type { DiaryVideo, VideoMetadata } from '@/types';

export type HydrationStatus = 'idle' | 'loading' | 'ready' | 'error';

export type VideoState = {
  status: HydrationStatus;
  error: string | null;
  ids: string[];
  byId: Record<string, DiaryVideo>;
  hydrate: () => Promise<void>;
  add: (video: DiaryVideo) => void;
  updateMetadata: (id: string, metadata: VideoMetadata, updatedAt: number) => void;
  remove: (id: string) => void;
};
