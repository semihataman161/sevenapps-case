import type { VideoRecord } from '@/services';

export type VideoRecordResult = {
  video: VideoRecord | undefined;
  isLoading: boolean;
};
