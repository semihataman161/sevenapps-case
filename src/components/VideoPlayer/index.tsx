import { useVideoPlayer } from 'expo-video';

import { configurePlayer } from '@/lib';

import { VideoFrame } from '../VideoFrame';
import type { VideoPlayerProps } from './types';

export type * from './types';

export function VideoPlayer({
  uri,
  autoPlay = false,
  loop = false,
  ...frameProps
}: VideoPlayerProps) {
  const player = useVideoPlayer(uri, (p) => {
    configurePlayer(p, { loop });
    if (autoPlay) p.play();
  });
  return <VideoFrame player={player} {...frameProps} />;
}
