import { VideoFrame } from '@/components/commons';
import { useMediaPlayer } from '@/hooks';

import type { VideoPlayerProps } from './types';

export type * from './types';

export function VideoPlayer({
  uri,
  autoPlay = false,
  loop = false,
  ...frameProps
}: VideoPlayerProps) {
  const media = useMediaPlayer(uri, { loop, autoPlay });

  return <VideoFrame player={media.native} {...frameProps} />;
}
