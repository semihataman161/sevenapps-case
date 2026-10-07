import type { MediaFrame, MediaPlayerContract } from '@/services';

export type FilmstripSource = Pick<MediaPlayerContract, 'createFilmstrip'>;

export type FilmstripFrames = MediaFrame[];

export type Filmstrip = {
  frames: FilmstripFrames;
  settled: boolean;
};
