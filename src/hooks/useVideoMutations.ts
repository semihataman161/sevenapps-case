import { useMutation } from '@tanstack/react-query';

import { videoRepository } from '@/db/videoRepository';
import { cropVideo, type CropVideoInput } from '@/services/cropVideo';
import { deleteFiles } from '@/services/videoFiles';
import { useVideoStore } from '@/store/videoStore';
import type { DiaryVideo, VideoMetadata } from '@/types/video';

export function useCropVideoMutation() {
  const add = useVideoStore((s) => s.add);
  return useMutation({
    mutationKey: ['videos', 'crop'],
    mutationFn: (input: CropVideoInput) => cropVideo(input),
    onSuccess: (video) => add(video),
  });
}

export function useUpdateVideoMutation(id: string) {
  const updateMetadata = useVideoStore((s) => s.updateMetadata);
  return useMutation({
    mutationKey: ['videos', 'update', id],
    mutationFn: async (metadata: VideoMetadata) => {
      const clean = { name: metadata.name.trim(), description: metadata.description.trim() };
      const updatedAt = Date.now();
      await videoRepository.updateMetadata(id, clean, updatedAt);
      return { metadata: clean, updatedAt };
    },
    onSuccess: ({ metadata, updatedAt }) => updateMetadata(id, metadata, updatedAt),
  });
}

export function useDeleteVideoMutation() {
  const remove = useVideoStore((s) => s.remove);
  return useMutation({
    mutationKey: ['videos', 'delete'],
    mutationFn: async (video: DiaryVideo) => {
      await videoRepository.remove(video.id);
      deleteFiles(video.fileName, video.thumbnailName);
      return video.id;
    },
    onSuccess: (id) => remove(id),
  });
}
