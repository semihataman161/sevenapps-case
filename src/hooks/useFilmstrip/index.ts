import type { VideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';

import type { FilmstripFrames } from './types';

export type * from './types';

export function useFilmstrip(
  player: VideoPlayer,
  duration: number,
  count: number,
  enabled: boolean,
): FilmstripFrames {
  const [frames, setFrames] = useState<FilmstripFrames>([]);

  useEffect(() => {
    if (!enabled || duration <= 0 || count <= 0) return;
    let cancelled = false;
    const step = duration / count;
    const times = Array.from({ length: count }, (_, i) => Math.min(duration, i * step + step / 2));
    player
      .generateThumbnailsAsync(times, { maxWidth: 160 })
      .then((result) => {
        if (!cancelled) setFrames(result);
      })
      .catch((error) => console.warn('Filmstrip generation failed', error));
    return () => {
      cancelled = true;
    };
  }, [player, duration, count, enabled]);

  return frames;
}
