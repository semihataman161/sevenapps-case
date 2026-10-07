import { waitFor } from '@testing-library/react-native';

import { useVideoRecord } from '@/hooks/useVideoRecord';
import { INITIAL_VIDEO_STATE } from '@/stores/videoStore/constants';
import { buildVideo } from '@/testing';
import { renderHookWithProviders } from '@/testing/render';
import type { ServicesMock } from '@/testing/services';

jest.mock('@/services', () =>
  jest
    .requireActual<typeof import('@/testing/services')>('@/testing/services')
    .createServicesMock(),
);

const { videoService, useVideoStore } = jest.requireMock<ServicesMock>('@/services');

describe('useVideoRecord', () => {
  beforeEach(() => {
    useVideoStore.setState(INITIAL_VIDEO_STATE);
  });

  it('returns a clip that is already loaded', async () => {
    const video = buildVideo({ id: 'a' });
    useVideoStore.setState({ status: 'ready', ids: ['a'], byId: { a: video } });

    const { result } = await renderHookWithProviders(() => useVideoRecord('a'));

    expect(result.current).toEqual({ video, isLoading: false });
    expect(videoService.get).not.toHaveBeenCalled();
  });

  it('waits for the list to load before looking a clip up', async () => {
    useVideoStore.setState({ status: 'loading' });

    const { result } = await renderHookWithProviders(() => useVideoRecord('a'));

    expect(result.current).toEqual({ video: undefined, isLoading: true });
    expect(videoService.get).not.toHaveBeenCalled();
  });

  it('loads a clip that is not in the loaded pages', async () => {
    const old = buildVideo({ id: 'old' });
    useVideoStore.setState({ status: 'ready' });
    videoService.get.mockResolvedValue(old);

    const { result } = await renderHookWithProviders(() => useVideoRecord('old'));

    await waitFor(() => expect(result.current).toEqual({ video: old, isLoading: false }));
    expect(videoService.get).toHaveBeenCalledWith('old');
  });

  it('reports a clip that does not exist', async () => {
    useVideoStore.setState({ status: 'ready' });
    videoService.get.mockResolvedValue(null);

    const { result } = await renderHookWithProviders(() => useVideoRecord('gone'));

    await waitFor(() => expect(result.current).toEqual({ video: undefined, isLoading: false }));
  });
});
