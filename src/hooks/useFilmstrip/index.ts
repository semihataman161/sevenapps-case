import type { VideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';

import type { Filmstrip } from './types';

export type * from './types';

export function useFilmstrip(
  player: VideoPlayer,
  duration: number,
  count: number,
  enabled: boolean,
): Filmstrip {
  const [filmstrip, setFilmstrip] = useState<Filmstrip>({ frames: [], settled: false });

  useEffect(() => {
    if (!enabled || duration <= 0 || count <= 0) return;
    let cancelled = false;
    const step = duration / count;
    const times = Array.from({ length: count }, (_, i) => Math.min(duration, i * step + step / 2));
    player
      .generateThumbnailsAsync(times, { maxWidth: 160 })
      .then((frames) => {
        if (!cancelled) setFilmstrip({ frames, settled: true });
      })
      .catch((error) => {
        console.warn('Filmstrip generation failed', error);
        if (!cancelled) setFilmstrip((current) => ({ ...current, settled: true }));
      });
    return () => {
      cancelled = true;
    };
  }, [player, duration, count, enabled]);

  return filmstrip;
}
