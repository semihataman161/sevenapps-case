import { useEffect, useState } from 'react';

import type { MediaPlayer } from '@/services';

import type { Filmstrip } from './types';

export type * from './types';

export function useFilmstrip(
  media: MediaPlayer,
  duration: number,
  count: number,
  enabled: boolean,
): Filmstrip {
  const [filmstrip, setFilmstrip] = useState<Filmstrip>({ frames: [], settled: false });

  useEffect(() => {
    if (!enabled || duration <= 0 || count <= 0) return;
    let cancelled = false;
    media
      .createFilmstrip({ duration, count })
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
  }, [media, duration, count, enabled]);

  return filmstrip;
}
