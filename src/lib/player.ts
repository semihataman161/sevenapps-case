import type { VideoPlayer } from 'expo-video';

export function seekTo(player: VideoPlayer, seconds: number): void {
  player.currentTime = seconds;
}

export function configurePlayer(
  player: VideoPlayer,
  options: Partial<Pick<VideoPlayer, 'loop' | 'muted' | 'timeUpdateEventInterval'>>,
): void {
  Object.assign(player, options);
}

export function pauseSafely(player: VideoPlayer): void {
  try {
    player.pause();
  } catch {}
}
