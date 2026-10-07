import { act, renderHook } from '@testing-library/react-native';

import {
  useSegmentPlayback,
  type SegmentPlaybackOptions,
  type SegmentPlayer,
} from '@/hooks/useSegmentPlayback';

const PLAYBACK_MS = 300;
const segment = { start: 4, end: 9 };

function fakeMedia(currentTime = 0) {
  let finish = () => {};
  const media: jest.Mocked<SegmentPlayer> = {
    currentTime,
    playbackRate: 1,
    pause: jest.fn(),
    seek: jest.fn(),
    playFrom: jest.fn(),
    onPlayToEnd: jest.fn((listener) => {
      finish = listener;
      return () => {};
    }),
  };
  return { media, reachEnd: () => finish() };
}

function renderPlayback(player: SegmentPlayer, options: Partial<SegmentPlaybackOptions> = {}) {
  return renderHook((props: SegmentPlaybackOptions) => useSegmentPlayback(player, props), {
    initialProps: { segment, isPlaying: false, enabled: true, ...options },
  });
}

describe('useSegmentPlayback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts the preview at the segment start once enabled', async () => {
    const { media } = fakeMedia();

    await renderPlayback(media, { enabled: true });

    expect(media.playFrom).toHaveBeenCalledWith(4);
  });

  it('does not start the preview while disabled', async () => {
    const { media } = fakeMedia();

    await renderPlayback(media, { enabled: false });

    expect(media.playFrom).not.toHaveBeenCalled();
  });

  it('pauses the preview when it gets disabled', async () => {
    const { media } = fakeMedia();
    const { rerender } = await renderPlayback(media, { enabled: true });

    await rerender({ segment, isPlaying: true, enabled: false });

    expect(media.pause).toHaveBeenCalled();
  });

  it('jumps back to the start just before the segment ends', async () => {
    const { media } = fakeMedia(8.99);
    await renderPlayback(media, { isPlaying: true });

    await act(() => jest.advanceTimersByTime(PLAYBACK_MS));

    expect(media.seek).toHaveBeenCalledWith(4);
  });

  it('lets playback continue inside the segment', async () => {
    const { media } = fakeMedia(6);
    await renderPlayback(media, { isPlaying: true });

    await act(() => jest.advanceTimersByTime(PLAYBACK_MS));

    expect(media.seek).not.toHaveBeenCalled();
  });

  it('restarts from the segment start when the video ends', async () => {
    const { media, reachEnd } = fakeMedia();
    await renderPlayback(media, { enabled: false });

    await act(() => reachEnd());

    expect(media.playFrom).toHaveBeenCalledWith(4);
  });

  it('scrubs by pausing and seeking', async () => {
    const { media } = fakeMedia();
    const { result } = await renderPlayback(media, { enabled: false });

    await act(() => result.current.scrubTo(7));

    expect(media.pause).toHaveBeenCalled();
    expect(media.seek).toHaveBeenCalledWith(7);
  });
});
