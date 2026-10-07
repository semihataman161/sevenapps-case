import type { VideoPlayer } from 'expo-video';
import type { ViewProps } from 'react-native';

export type VideoFrameProps = ViewProps & {
  player: VideoPlayer;
  aspectRatio?: number;
  maxHeightRatio?: number;
  nativeControls?: boolean;
  className?: string;
};
