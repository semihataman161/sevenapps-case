import type { VideoDetails, VideoSource } from '@/services';

export type CropVideoInput = {
  source: VideoSource;
  start: number;
  details: VideoDetails;
};

export type VideoOperation = 'crop' | 'update' | 'delete';

export type VideoErrorKey =
  | 'errors.segmentOutside'
  | 'errors.sourceUnreadable'
  | 'errors.videoNotFound'
  | 'errors.cropFailed'
  | 'errors.updateFailed'
  | 'errors.deleteFailed';

export type CropJobStatus = 'pending' | 'error';

export type CropJob = {
  id: number;
  title: string;
  status: CropJobStatus;
  errorKey: VideoErrorKey | null;
};
