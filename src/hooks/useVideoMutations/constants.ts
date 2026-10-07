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
