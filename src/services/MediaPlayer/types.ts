import type { VideoPlayer, VideoPlayerStatus, VideoThumbnail } from 'expo-video';

export type NativePlayer = VideoPlayer;

export type MediaPlayerStatus = VideoPlayerStatus;

export type MediaFrame = VideoThumbnail;

export type MediaPlayerSettings = {
  loop?: boolean;
  muted?: boolean;
  timeUpdateInterval?: number;
};

export type FilmstripRequest = {
  count: number;
  duration?: number;
  maxWidth?: number;
};

export type Unsubscribe = () => void;

export type MediaPlayerContract = {
  readonly native: NativePlayer;
  readonly status: MediaPlayerStatus;
  readonly isPlaying: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly playbackRate: number;
  configure: (settings: MediaPlayerSettings) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  playFrom: (seconds: number) => void;
  createFilmstrip: (request: FilmstripRequest) => Promise<MediaFrame[]>;
  onStatusChange: (listener: (status: MediaPlayerStatus) => void) => Unsubscribe;
  onPlayingChange: (listener: (isPlaying: boolean) => void) => Unsubscribe;
  onTimeUpdate: (listener: (seconds: number) => void) => Unsubscribe;
  onPlayToEnd: (listener: () => void) => Unsubscribe;
  onLoad: (listener: (duration: number) => void) => Unsubscribe;
};
