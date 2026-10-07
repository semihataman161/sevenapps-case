import { useCallback, useEffect, useEffectEvent, useState, useSyncExternalStore } from 'react';

import type { MediaPlayer } from '@/services';

import type { PlayerStatus } from './types';

export type * from './types';

export function usePlayerStatus(
  media: MediaPlayer,
  onLoad?: (duration: number) => void,
): PlayerStatus {
  const subscribeStatus = useCallback(
    (notify: () => void) => media.onStatusChange(notify),
    [media],
  );
  const subscribePlaying = useCallback(
    (notify: () => void) => media.onPlayingChange(notify),
    [media],
  );
  const status = useSyncExternalStore(subscribeStatus, () => media.status);
  const isPlaying = useSyncExternalStore(subscribePlaying, () => media.isPlaying);
  const [isLoaded, setIsLoaded] = useState(false);

  const markLoaded = useEffectEvent((duration: number) => {
    if (duration > 0) onLoad?.(duration);
    setIsLoaded(true);
  });

  useEffect(() => media.onLoad((duration) => markLoaded(duration)), [media]);

  return { status, isPlaying, isLoaded };
}
