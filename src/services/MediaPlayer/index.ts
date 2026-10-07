import { DEFAULT_FRAME_WIDTH } from './constants';
import type {
  FilmstripRequest,
  MediaFrame,
  MediaPlayerContract,
  MediaPlayerSettings,
  MediaPlayerStatus,
  NativePlayer,
  Unsubscribe,
} from './types';

export type * from './types';

function frameTimes(duration: number, count: number): number[] {
  const step = duration / count;
  return Array.from({ length: count }, (_, index) => Math.min(duration, index * step + step / 2));
}

export class MediaPlayer implements MediaPlayerContract {
  constructor(readonly native: NativePlayer) {}

  get status(): MediaPlayerStatus {
    return this.native.status;
  }

  get isPlaying(): boolean {
    return this.native.playing;
  }

  get currentTime(): number {
    return this.native.currentTime;
  }

  get duration(): number {
    return this.native.duration;
  }

  get playbackRate(): number {
    return this.native.playbackRate;
  }

  configure({ loop, muted, timeUpdateInterval }: MediaPlayerSettings): void {
    if (loop !== undefined) this.native.loop = loop;
    if (muted !== undefined) this.native.muted = muted;
    if (timeUpdateInterval !== undefined) this.native.timeUpdateEventInterval = timeUpdateInterval;
  }

  play(): void {
    this.native.play();
  }

  pause(): void {
    try {
      this.native.pause();
    } catch {}
  }

  toggle(): void {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  seek(seconds: number): void {
    this.native.currentTime = seconds;
  }

  playFrom(seconds: number): void {
    this.seek(seconds);
    this.play();
  }

  createFilmstrip({
    count,
    duration = this.duration,
    maxWidth = DEFAULT_FRAME_WIDTH,
  }: FilmstripRequest): Promise<MediaFrame[]> {
    if (duration <= 0 || count <= 0) return Promise.resolve([]);
    return this.native.generateThumbnailsAsync(frameTimes(duration, count), { maxWidth });
  }

  onStatusChange(listener: (status: MediaPlayerStatus) => void): Unsubscribe {
    const subscription = this.native.addListener('statusChange', ({ status }) => listener(status));
    return () => subscription.remove();
  }

  onPlayingChange(listener: (isPlaying: boolean) => void): Unsubscribe {
    const subscription = this.native.addListener('playingChange', ({ isPlaying }) =>
      listener(isPlaying),
    );
    return () => subscription.remove();
  }

  onTimeUpdate(listener: (seconds: number) => void): Unsubscribe {
    const subscription = this.native.addListener('timeUpdate', ({ currentTime }) =>
      listener(currentTime),
    );
    return () => subscription.remove();
  }

  onPlayToEnd(listener: () => void): Unsubscribe {
    const subscription = this.native.addListener('playToEnd', () => listener());
    return () => subscription.remove();
  }

  onLoad(listener: (duration: number) => void): Unsubscribe {
    const notify = () => listener(this.duration);
    const subscriptions = [
      this.native.addListener('sourceLoad', notify),
      this.native.addListener('statusChange', ({ status }) => {
        if (status === 'readyToPlay') notify();
      }),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }
}
