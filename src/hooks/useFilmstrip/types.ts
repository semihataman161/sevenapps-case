import type { VideoThumbnail } from 'expo-video';

export type FilmstripFrames = VideoThumbnail[];

export type Filmstrip = {
  frames: FilmstripFrames;
  settled: boolean;
};
