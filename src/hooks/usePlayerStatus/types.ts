import type { MediaPlayerStatus } from '@/services';

export type PlayerStatus = {
  status: MediaPlayerStatus;
  isPlaying: boolean;
  isLoaded: boolean;
};
