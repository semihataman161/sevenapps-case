import * as Haptics from 'expo-haptics';
import {
  useMutation,
  useMutationState,
  useQueryClient,
  type Mutation,
} from '@tanstack/react-query';

import { segmentBounds } from '@/lib';
import {
  useVideoStore,
  videoErrorCode,
  videoService,
  type VideoDetails,
  type VideoRecord,
} from '@/services';

import { FALLBACK_ERROR_KEYS, KNOWN_ERROR_KEYS, videoKeys } from './constants';
import type { CropJob, CropVideoInput, VideoErrorKey, VideoOperation } from './types';

export type * from './types';

export function videoErrorKey(error: unknown, operation: VideoOperation): VideoErrorKey {
  const code = videoErrorCode(error);
  return code === 'unknown' ? FALLBACK_ERROR_KEYS[operation] : KNOWN_ERROR_KEYS[code];
}

export function useCropVideoMutation() {
  const add = useVideoStore((s) => s.add);

  return useMutation({
    mutationKey: videoKeys.crop(),
    mutationFn: ({ source, start, details }: CropVideoInput) =>
      videoService.crop({
        source,
        range: segmentBounds(start, source.duration),
        details,
      }),
    onSuccess: (video) => {
      add(video);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    },
    onError: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    },
    gcTime: Infinity,
  });
}

export function isCropJob(mutation: Mutation<unknown, Error, unknown, unknown>): boolean {
  const { status } = mutation.state;
  return status === 'pending' || status === 'error';
}

export function toCropJob(mutation: Mutation<unknown, Error, unknown, unknown>): CropJob {
  const { status, variables, error } = mutation.state;
  return {
    id: mutation.mutationId,
    title: (variables as CropVideoInput).details.name,
    status: status === 'error' ? 'error' : 'pending',
    errorKey: status === 'error' ? videoErrorKey(error, 'crop') : null,
  };
}

export function useCropJobs() {
  const queryClient = useQueryClient();
  const cropMutation = useCropVideoMutation();
  const jobs = [
    ...useMutationState({
      filters: { mutationKey: videoKeys.crop(), predicate: isCropJob },
      select: toCropJob,
    }),
  ].reverse();

  const findMutation = (id: number) =>
    queryClient.getMutationCache().find({
      mutationKey: videoKeys.crop(),
      predicate: (mutation) => mutation.mutationId === id,
    });

  const dismiss = (id: number) => {
    const mutation = findMutation(id);
    if (mutation) queryClient.getMutationCache().remove(mutation);
  };

  const retry = (id: number) => {
    const variables = findMutation(id)?.state.variables as CropVideoInput | undefined;
    if (!variables) return;
    dismiss(id);
    cropMutation.mutate(variables);
  };

  return { jobs, retry, dismiss };
}

export function useUpdateVideoMutation(id: string) {
  const updateDetails = useVideoStore((s) => s.updateDetails);

  return useMutation({
    mutationKey: videoKeys.update(id),
    mutationFn: (details: VideoDetails) => videoService.updateDetails(id, details),
    onSuccess: ({ details, updatedAt }) => updateDetails(id, details, updatedAt),
  });
}

export function useDeleteVideoMutation() {
  const remove = useVideoStore((s) => s.remove);

  return useMutation({
    mutationKey: videoKeys.delete(),
    mutationFn: (video: VideoRecord) => videoService.delete(video),
    onSuccess: (_, video) => remove(video.id),
  });
}
