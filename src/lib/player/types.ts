import type { VideoPlayer } from 'expo-video';

export type PlayerOptions = Partial<
  Pick<VideoPlayer, 'loop' | 'muted' | 'timeUpdateEventInterval'>
>;
