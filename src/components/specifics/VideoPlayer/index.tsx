import { useVideoPlayer } from 'expo-video';

import { VideoFrame } from '@/components/commons';
import { configurePlayer } from '@/lib';

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
