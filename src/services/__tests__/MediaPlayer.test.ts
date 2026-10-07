import { MediaPlayer, type NativePlayer } from '@/services/MediaPlayer';

type Listener = (payload?: unknown) => void;

function fakeNativePlayer(overrides: Record<string, unknown> = {}) {
  const listeners = new Map<string, Set<Listener>>();
  const native = {
    playing: false,
    currentTime: 0,
    duration: 10,
    loop: true,
    muted: false,
    timeUpdateEventInterval: 0,
    play: jest.fn(),
    pause: jest.fn(),
    generateThumbnailsAsync: jest.fn(async () => []),
    addListener: jest.fn((event: string, listener: Listener) => {
      const set = listeners.get(event) ?? new Set<Listener>();
      set.add(listener);
      listeners.set(event, set);
      return { remove: () => set.delete(listener) };
    }),
    ...overrides,
  };
  const emit = (event: string, payload?: unknown) =>
    listeners.get(event)?.forEach((listener) => listener(payload));
  const listenerCount = () => [...listeners.values()].reduce((total, set) => total + set.size, 0);
  const media = new MediaPlayer(native as unknown as NativePlayer);
  return { native, media, emit, listenerCount };
}

describe('MediaPlayer.configure', () => {
  it('changes only the settings it is given', () => {
    const { native, media } = fakeNativePlayer();

    media.configure({ loop: false, timeUpdateInterval: 0.1 });

    expect(native).toMatchObject({ loop: false, muted: false, timeUpdateEventInterval: 0.1 });
  });
});

describe('MediaPlayer.toggle', () => {
  it('pauses a playing player', () => {
    const { native, media } = fakeNativePlayer({ playing: true });

    media.toggle();

    expect(native.pause).toHaveBeenCalledTimes(1);
    expect(native.play).not.toHaveBeenCalled();
  });

  it('plays a paused player', () => {
    const { native, media } = fakeNativePlayer({ playing: false });

    media.toggle();

    expect(native.play).toHaveBeenCalledTimes(1);
  });
});

describe('MediaPlayer.pause', () => {
  it('does not throw when the native player is already released', () => {
    const { media } = fakeNativePlayer({
      pause: () => {
        throw new Error('released');
      },
    });

    expect(() => media.pause()).not.toThrow();
  });
});

describe('MediaPlayer.createFilmstrip', () => {
  it('asks for frames in the middle of evenly sized slices', async () => {
    const { native, media } = fakeNativePlayer();

    await media.createFilmstrip({ duration: 8, count: 4, maxWidth: 100 });

    expect(native.generateThumbnailsAsync).toHaveBeenCalledWith([1, 3, 5, 7], { maxWidth: 100 });
  });

  it('uses the player duration and the default width when none are given', async () => {
    const { native, media } = fakeNativePlayer({ duration: 4 });

    await media.createFilmstrip({ count: 2 });

    expect(native.generateThumbnailsAsync).toHaveBeenCalledWith([1, 3], { maxWidth: 160 });
  });

  it.each([[{ count: 4, duration: 0 }], [{ count: 0, duration: 8 }]])(
    'returns no frames for %j',
    async (request) => {
      const { native, media } = fakeNativePlayer();

      await expect(media.createFilmstrip(request)).resolves.toEqual([]);

      expect(native.generateThumbnailsAsync).not.toHaveBeenCalled();
    },
  );
});

describe('MediaPlayer.onLoad', () => {
  it('reports the duration when the source loads', () => {
    const { media, emit } = fakeNativePlayer({ duration: 12 });
    const onLoad = jest.fn();
    media.onLoad(onLoad);

    emit('sourceLoad');

    expect(onLoad).toHaveBeenCalledWith(12);
  });

  it('reports a load only for the ready-to-play status', () => {
    const { media, emit } = fakeNativePlayer();
    const onLoad = jest.fn();
    media.onLoad(onLoad);

    emit('statusChange', { status: 'loading' });
    emit('statusChange', { status: 'readyToPlay' });

    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('removes both native listeners when unsubscribed', () => {
    const { media, listenerCount } = fakeNativePlayer();
    const unsubscribe = media.onLoad(jest.fn());

    unsubscribe();

    expect(listenerCount()).toBe(0);
  });
});
