import { useCallback, useEffect, useEffectEvent, useRef } from 'react';

import { LOOP_LEAD, MAX_LOOKAHEAD, RESTART_TOLERANCE, SEEK_SETTLE_MS } from './constants';
import type { SegmentPlayback, SegmentPlaybackOptions, SegmentPlayer } from './types';

export type * from './types';

export function useSegmentPlayback(
  media: SegmentPlayer,
  { segment, isPlaying, enabled }: SegmentPlaybackOptions,
): SegmentPlayback {
  const lastCheck = useRef({ at: 0, loopedAt: 0 });

  const scrubTo = useCallback(
    (seconds: number) => {
      media.pause();
      media.seek(seconds);
    },
    [media],
  );

  const keepInSegment = useEffectEvent(() => {
    const now = performance.now();
    const check = lastCheck.current;
    const sinceLastCheck = check.at ? (now - check.at) / 1000 : 1 / 60;
    check.at = now;
    if (now - check.loopedAt < SEEK_SETTLE_MS) return;

    const position = media.currentTime;
    const nextPosition = position + Math.min(sinceLastCheck, MAX_LOOKAHEAD) * media.playbackRate;
    if (nextPosition >= segment.end - LOOP_LEAD || position < segment.start - RESTART_TOLERANCE) {
      check.loopedAt = now;
      media.seek(segment.start);
    }
  });

  const restart = useEffectEvent(() => media.playFrom(segment.start));

  useEffect(() => media.onPlayToEnd(() => restart()), [media]);

  useEffect(() => {
    if (!isPlaying || !enabled) return;
    lastCheck.current.at = 0;
    let frame = requestAnimationFrame(function tick() {
      keepInSegment();
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, enabled]);

  useEffect(() => {
    if (!enabled) return;
    restart();
    return () => media.pause();
  }, [media, enabled]);

  return { scrubTo };
}
