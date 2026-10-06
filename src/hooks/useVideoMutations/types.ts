import type { VideoMetadata } from '@/types';

export type UpdateVideoResult = {
  metadata: VideoMetadata;
  updatedAt: number;
};
