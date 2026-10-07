import { useMutation } from '@tanstack/react-query';

import { segmentBounds } from '@/lib';
import { videoService, type VideoDetails, type VideoRecord } from '@/services';
import { useVideoStore } from '@/stores';

import { FALLBACK_ERROR_KEYS, KNOWN_ERROR_KEYS } from './constants';
import type { CropVideoInput, VideoErrorKey, VideoOperation } from './types';

export type * from './types';

export function videoErrorKey(error: unknown, operation: VideoOperation): VideoErrorKey {
  const code = videoService.errorCode(error);
  return code === 'unknown' ? FALLBACK_ERROR_KEYS[operation] : KNOWN_ERROR_KEYS[code];
}

export function useCropVideoMutation() {
  const add = useVideoStore((s) => s.add);

  return useMutation({
    mutationKey: ['videos', 'crop'],
    mutationFn: ({ source, start, details }: CropVideoInput) =>
      videoService.crop({
        source,
        range: segmentBounds(start, source.duration),
        details,
      }),
    onSuccess: (video) => add(video),
  });
}

export function useUpdateVideoMutation(id: string) {
  const updateDetails = useVideoStore((s) => s.updateDetails);

  return useMutation({
    mutationKey: ['videos', 'update', id],
    mutationFn: (details: VideoDetails) => videoService.updateDetails(id, details),
    onSuccess: ({ details, updatedAt }) => updateDetails(id, details, updatedAt),
  });
}

export function useDeleteVideoMutation() {
  const remove = useVideoStore((s) => s.remove);

  return useMutation({
    mutationKey: ['videos', 'delete'],
    mutationFn: async (video: VideoRecord) => {
      await videoService.delete(video);
      return video.id;
    },
    onSuccess: (id) => remove(id),
  });
}
