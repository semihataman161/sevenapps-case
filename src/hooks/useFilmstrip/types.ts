import type { VideoFrame } from '@/services';

export type FilmstripFrames = VideoFrame[];

export type Filmstrip = {
  frames: FilmstripFrames;
  settled: boolean;
};
