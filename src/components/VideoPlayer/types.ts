import type { VideoFrameProps } from '../VideoFrame';

export type VideoPlayerProps = Omit<VideoFrameProps, 'player'> & {
  uri: string;
  autoPlay?: boolean;
  loop?: boolean;
};
