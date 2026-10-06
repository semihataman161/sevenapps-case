import type { SourceVideo } from '@/types';

export type CropDraftState = {
  source: SourceVideo | null;
  start: number;
  setSource: (source: SourceVideo) => void;
  setDuration: (duration: number) => void;
  setStart: (start: number) => void;
  reset: () => void;
};
