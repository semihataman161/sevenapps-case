import type { SourceVideo, VideoMetadata } from '@/types';

export type CropVideoInput = {
  source: SourceVideo;
  start: number;
  metadata: VideoMetadata;
};

export type CropErrorKey =
  'errors.segmentOutside' | 'errors.sourceUnreadable' | 'errors.cropFailed';

export type NativeTrimError = {
  code?: string;
};
