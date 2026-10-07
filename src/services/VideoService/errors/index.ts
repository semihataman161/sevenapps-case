import { NATIVE_ERROR_CODES } from '../constants';
import type { VideoErrorCode } from '../types';

export class VideoServiceError extends Error {
  constructor(
    readonly code: VideoErrorCode,
    message: string = code,
  ) {
    super(message);
    this.name = 'VideoServiceError';
  }
}

export function videoErrorCode(error: unknown): VideoErrorCode {
  if (error instanceof VideoServiceError) return error.code;
  const code = (error as { code?: unknown } | null)?.code;
  const mapped = typeof code === 'string' ? NATIVE_ERROR_CODES[code] : undefined;
  if (!mapped) console.warn('Video operation failed', error);
  return mapped ?? 'unknown';
}
