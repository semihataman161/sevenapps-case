import type { VideoSource } from '@/services';

export type CropDraftState = {
  source: VideoSource | null;
  start: number;
};

export type CropDraftActions = {
  setSource: (source: VideoSource) => void;
  setDuration: (duration: number) => void;
  setStart: (start: number) => void;
  reset: () => void;
};

export type CropDraftStore = CropDraftState & CropDraftActions;
