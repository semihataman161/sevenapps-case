import type { VideoErrorCode } from './types';

export const VIDEO_EXTENSION = 'mp4';

export const THUMBNAIL_EXTENSION = 'jpg';

export const NATIVE_ERROR_CODES: Record<string, VideoErrorCode> = {
  INVALID_END: 'rangeOutOfBounds',
  INVALID_RANGE: 'rangeOutOfBounds',
  INVALID_START: 'rangeOutOfBounds',
  FILE_NOT_FOUND: 'sourceUnreadable',
  INVALID_URI: 'sourceUnreadable',
};
