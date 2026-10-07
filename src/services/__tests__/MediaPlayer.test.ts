import { MediaPlayer, type NativePlayer } from '@/services/MediaPlayer';

type Listener = (payload?: unknown) => void;

function makeNative(overrides: Record<string, unknown> = {}) {
  const listeners = new Map<string, Set<Listener>>();
  const native = {
    status: 'idle',
    playing: false,
    currentTime: 0,
    duration: 10,
    playbackRate: 1,
    loop: true,
    muted: false,
    timeUpdateEventInterval: 0,
    play: jest.fn(function (this: { playing: boolean }) {
      this.playing = true;
    }),
    pause: jest.fn(function (this: { playing: boolean }) {
      this.playing = false;
    }),
    generateThumbnailsAsync: jest.fn(async () => []),
    addListener: jest.fn((event: string, listener: Listener) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)?.add(listener);
      return { remove: () => listeners.get(event)?.delete(listener) };
    }),
    ...overrides,
  };
  const emit = (event: string, payload?: unknown) =>
    listeners.get(event)?.forEach((listener) => listener(payload));
  const count = (event: string) => listeners.get(event)?.size ?? 0;
  return { native, media: new MediaPlayer(native as unknown as NativePlayer), emit, count };
}

describe('MediaPlayer', () => {
  it('applies only the settings it is given', () => {
    const { native, media } = makeNative();
    media.configure({ loop: false, timeUpdateInterval: 0.1 });
    expect(native).toMatchObject({ loop: false, muted: false, timeUpdateEventInterval: 0.1 });
  });

  it('seeks, plays from a position and toggles playback', () => {
    const { native, media } = makeNative();
    media.playFrom(4);
    expect(native.currentTime).toBe(4);
    expect(media.isPlaying).toBe(true);

    media.toggle();
    expect(native.pause).toHaveBeenCalledTimes(1);
    media.toggle();
    expect(native.play).toHaveBeenCalledTimes(2);
  });

  it('pauses safely when the native player is already released', () => {
    const { media } = makeNative({
      pause: () => {
        throw new Error('released');
      },
    });
    expect(() => media.pause()).not.toThrow();
  });

  it('asks for evenly spaced filmstrip frames over the given or current duration', async () => {
    const { native, media } = makeNative({ duration: 4 });
    await media.createFilmstrip({ duration: 8, count: 4, maxWidth: 100 });
    expect(native.generateThumbnailsAsync).toHaveBeenCalledWith([1, 3, 5, 7], { maxWidth: 100 });

    await media.createFilmstrip({ count: 2 });
    expect(native.generateThumbnailsAsync).toHaveBeenLastCalledWith([1, 3], { maxWidth: 160 });
  });

  it('returns no frames for an empty request', async () => {
    const { native, media } = makeNative({ duration: 0 });
    await expect(media.createFilmstrip({ count: 4 })).resolves.toEqual([]);
    expect(native.generateThumbnailsAsync).not.toHaveBeenCalled();
  });

  it('forwards player events as plain values and unsubscribes', () => {
    const { media, emit, count } = makeNative();
    const onStatus = jest.fn();
    const onTime = jest.fn();
    const stopStatus = media.onStatusChange(onStatus);
    media.onTimeUpdate(onTime);

    emit('statusChange', { status: 'loading' });
    emit('timeUpdate', { currentTime: 2.5 });
    expect(onStatus).toHaveBeenCalledWith('loading');
    expect(onTime).toHaveBeenCalledWith(2.5);

    stopStatus();
    expect(count('statusChange')).toBe(0);
  });

  it('reports a load with the duration on source load or when ready to play', () => {
    const { media, emit, count } = makeNative({ duration: 12 });
    const onLoad = jest.fn();
    const stop = media.onLoad(onLoad);

    emit('sourceLoad');
    emit('statusChange', { status: 'loading' });
    emit('statusChange', { status: 'readyToPlay' });
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).toHaveBeenCalledWith(12);

    stop();
    expect(count('sourceLoad') + count('statusChange')).toBe(0);
  });
});
