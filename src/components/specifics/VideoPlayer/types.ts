import type { VideoFrameProps } from '@/components/commons';

export type VideoPlayerProps = Omit<VideoFrameProps, 'player'> & {
  uri: string;
  autoPlay?: boolean;
  loop?: boolean;
};
