import { useVideoPlayer } from 'expo-video';
import { useMemo } from 'react';

import { MediaPlayer } from '@/services';

import type { MediaPlayerOptions } from './types';

export type * from './types';

export function useMediaPlayer(
  uri: string,
  { autoPlay = false, ...settings }: MediaPlayerOptions = {},
): MediaPlayer {
  const native = useVideoPlayer(uri, (player) => {
    const media = new MediaPlayer(player);
    media.configure(settings);
    if (autoPlay) media.play();
  });

  return useMemo(() => new MediaPlayer(native), [native]);
}
