import type { MediaFrame } from '@/services';

export type FilmstripFrames = MediaFrame[];

export type Filmstrip = {
  frames: FilmstripFrames;
  settled: boolean;
};
