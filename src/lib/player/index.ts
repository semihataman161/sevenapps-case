import type { VideoPlayer } from 'expo-video';

import type { PlayerOptions } from './types';

export type * from './types';

export function seekTo(player: VideoPlayer, seconds: number): void {
  player.currentTime = seconds;
}

export function configurePlayer(player: VideoPlayer, options: PlayerOptions): void {
  Object.assign(player, options);
}

export function pauseSafely(player: VideoPlayer): void {
  try {
    player.pause();
  } catch {}
}
