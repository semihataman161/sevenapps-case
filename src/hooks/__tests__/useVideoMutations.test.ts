import { act, waitFor } from '@testing-library/react-native';

import { useCropJobs, useCropVideoMutation, videoErrorKey } from '@/hooks/useVideoMutations';
import type { CropVideoInput } from '@/hooks/useVideoMutations/types';
import { VideoServiceError } from '@/services/VideoService';
import { INITIAL_VIDEO_STATE } from '@/stores/videoStore/constants';
import { buildSource, buildVideo } from '@/testing';
import { renderHookWithProviders } from '@/testing/render';
import type { ServicesMock } from '@/testing/services';

jest.mock('@/services', () =>
  jest
    .requireActual<typeof import('@/testing/services')>('@/testing/services')
    .createServicesMock(),
);
jest.mock('expo-haptics', () => ({
  notificationAsync: () => Promise.resolve(),
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
}));

const { videoService, useVideoStore } = jest.requireMock<ServicesMock>('@/services');

function cropInput(name: string): CropVideoInput {
  return { source: buildSource(), start: 0, details: { name, description: '' } };
}

async function renderCropJobs() {
  return renderHookWithProviders(() => ({ ...useCropJobs(), crop: useCropVideoMutation() }));
}

describe('videoErrorKey', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it.each([
    ['rangeOutOfBounds', 'errors.segmentOutside'],
    ['sourceUnreadable', 'errors.sourceUnreadable'],
    ['notFound', 'errors.videoNotFound'],
  ] as const)('maps a %s error to %s', (code, key) => {
    expect(videoErrorKey(new VideoServiceError(code), 'crop')).toBe(key);
  });

  it.each([
    ['crop', 'errors.cropFailed'],
    ['update', 'errors.updateFailed'],
    ['delete', 'errors.deleteFailed'],
  ] as const)('falls back to the %s message for an unknown error', (operation, key) => {
    expect(videoErrorKey(new Error('boom'), operation)).toBe(key);
  });
});

describe('useCropJobs', () => {
  beforeEach(() => {
    useVideoStore.setState(INITIAL_VIDEO_STATE);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('lists running crops with the newest first', async () => {
    videoService.crop.mockReturnValue(new Promise(() => {}));
    const { result } = await renderCropJobs();

    await act(async () => {
      result.current.crop.mutate(cropInput('First'));
      result.current.crop.mutate(cropInput('Second'));
    });

    await waitFor(() =>
      expect(result.current.jobs.map((job) => job.title)).toEqual(['Second', 'First']),
    );
    expect(result.current.jobs.every((job) => job.status === 'pending')).toBe(true);
  });

  it('adds a saved clip to the list and drops its job', async () => {
    const video = buildVideo({ id: 'saved' });
    videoService.crop.mockResolvedValue(video);
    const { result } = await renderCropJobs();

    await act(async () => {
      result.current.crop.mutate(cropInput('Saved'));
    });

    await waitFor(() => expect(useVideoStore.getState().ids).toEqual(['saved']));
    expect(result.current.jobs).toEqual([]);
  });

  it('keeps a failed crop with its error message', async () => {
    videoService.crop.mockRejectedValue(new VideoServiceError('sourceUnreadable'));
    const { result } = await renderCropJobs();

    await act(async () => {
      result.current.crop.mutate(cropInput('Broken'));
    });

    await waitFor(() =>
      expect(result.current.jobs).toEqual([
        expect.objectContaining({
          title: 'Broken',
          status: 'error',
          errorKey: 'errors.sourceUnreadable',
        }),
      ]),
    );
  });

  it('retries a failed crop with the same input', async () => {
    videoService.crop
      .mockRejectedValueOnce(new Error('boom'))
      .mockReturnValue(new Promise(() => {}));
    const { result } = await renderCropJobs();
    await act(async () => {
      result.current.crop.mutate(cropInput('Again'));
    });
    await waitFor(() => expect(result.current.jobs[0]?.status).toBe('error'));

    await act(async () => result.current.retry(result.current.jobs[0].id));

    await waitFor(() =>
      expect(result.current.jobs).toEqual([
        expect.objectContaining({ title: 'Again', status: 'pending' }),
      ]),
    );
    expect(videoService.crop).toHaveBeenCalledTimes(2);
    expect(videoService.crop.mock.calls[1]).toEqual(videoService.crop.mock.calls[0]);
  });

  it('dismisses a failed crop', async () => {
    videoService.crop.mockRejectedValue(new Error('boom'));
    const { result } = await renderCropJobs();
    await act(async () => {
      result.current.crop.mutate(cropInput('Gone'));
    });
    await waitFor(() => expect(result.current.jobs).toHaveLength(1));

    await act(async () => result.current.dismiss(result.current.jobs[0].id));

    await waitFor(() => expect(result.current.jobs).toEqual([]));
  });
});
