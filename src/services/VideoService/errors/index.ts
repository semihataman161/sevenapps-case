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
