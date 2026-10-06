import type { VideoPlayer } from 'expo-video';

export type VideoFrameProps = {
  player: VideoPlayer;
  aspectRatio?: number;
  nativeControls?: boolean;
  className?: string;
};
