import { trimVideo } from 'expo-trim-video';

import { videoRepository } from '@/db';
import { createId, segmentBounds } from '@/lib';
import type { DiaryVideo } from '@/types';

import { createThumbnail, deleteFiles, persistClip, videoUri } from '../videoFiles';
import type { CropErrorKey, CropVideoInput, NativeTrimError } from './types';

export type * from './types';

export async function cropVideo({ source, start, metadata }: CropVideoInput): Promise<DiaryVideo> {
  const bounds = segmentBounds(start, source.duration);
  const trimmed = await trimVideo({ uri: source.uri, start: bounds.start, end: bounds.end });

  const id = createId();
  const fileName = await persistClip(trimmed.uri, id);
  const thumbnailName = await createThumbnail(videoUri(fileName), id);

  const now = Date.now();
  const video: DiaryVideo = {
    id,
    name: metadata.name.trim(),
    description: metadata.description.trim(),
    fileName,
    thumbnailName,
    duration: bounds.end - bounds.start,
    sourceStart: bounds.start,
    width: source.width,
    height: source.height,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await videoRepository.insert(video);
  } catch (error) {
    deleteFiles(fileName, thumbnailName);
    throw error;
  }
  return video;
}

export function describeCropError(error: unknown): CropErrorKey {
  const code = (error as NativeTrimError | null)?.code;
  switch (code) {
    case 'INVALID_END':
    case 'INVALID_RANGE':
    case 'INVALID_START':
      return 'errors.segmentOutside';
    case 'FILE_NOT_FOUND':
    case 'INVALID_URI':
      return 'errors.sourceUnreadable';
    default:
      console.warn('Crop failed', error);
      return 'errors.cropFailed';
  }
}
