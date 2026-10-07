import { renderHook, waitFor } from '@testing-library/react-native';

import { useFilmstrip, type FilmstripSource } from '@/hooks/useFilmstrip';
import type { MediaFrame } from '@/services';

const frame = { requestedTime: 1, actualTime: 1 } as unknown as MediaFrame;

function fakeMedia(createFilmstrip: FilmstripSource['createFilmstrip']): FilmstripSource {
  return { createFilmstrip };
}

describe('useFilmstrip', () => {
  it('waits until it is enabled', async () => {
    const createFilmstrip = jest.fn<Promise<MediaFrame[]>, []>();
    const media = fakeMedia(createFilmstrip);

    const { result } = await renderHook(() => useFilmstrip(media, 20, 8, false));

    expect(createFilmstrip).not.toHaveBeenCalled();
    expect(result.current).toEqual({ frames: [], settled: false });
  });

  it('returns the frames once they are generated', async () => {
    const createFilmstrip = jest.fn<Promise<MediaFrame[]>, []>().mockResolvedValue([frame]);
    const media = fakeMedia(createFilmstrip);

    const { result } = await renderHook(() => useFilmstrip(media, 20, 8, true));

    await waitFor(() => expect(result.current).toEqual({ frames: [frame], settled: true }));
    expect(createFilmstrip).toHaveBeenCalledTimes(1);
    expect(createFilmstrip).toHaveBeenCalledWith({ duration: 20, count: 8 });
  });

  it('settles without frames when generation fails', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const media = fakeMedia(jest.fn().mockRejectedValue(new Error('no frames')));

    const { result } = await renderHook(() => useFilmstrip(media, 20, 8, true));

    await waitFor(() => expect(result.current).toEqual({ frames: [], settled: true }));
  });
});
