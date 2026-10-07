import type { VideoErrorCode } from '@/services';

import type { VideoErrorKey, VideoOperation } from './types';

export const KNOWN_ERROR_KEYS: Record<Exclude<VideoErrorCode, 'unknown'>, VideoErrorKey> = {
  rangeOutOfBounds: 'errors.segmentOutside',
  sourceUnreadable: 'errors.sourceUnreadable',
  notFound: 'errors.videoNotFound',
};

export const FALLBACK_ERROR_KEYS: Record<VideoOperation, VideoErrorKey> = {
  crop: 'errors.cropFailed',
  update: 'errors.updateFailed',
  delete: 'errors.deleteFailed',
};

export const videoKeys = {
  all: ['videos'] as const,
  crop: () => [...videoKeys.all, 'crop'] as const,
  update: (id: string) => [...videoKeys.all, 'update', id] as const,
  delete: () => [...videoKeys.all, 'delete'] as const,
};
