import { trimVideo } from 'expo-trim-video';

import { videoRepository } from '@/db/videoRepository';
import { createId } from '@/lib/id';
import { segmentBounds } from '@/lib/time';
import type { DiaryVideo, SourceVideo, VideoMetadata } from '@/types/video';

import { createThumbnail, deleteFiles, persistClip, videoUri } from './videoFiles';

export type CropVideoInput = {
  source: SourceVideo;
  start: number;
  metadata: VideoMetadata;
};

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

export function describeCropError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  switch (code) {
    case 'INVALID_END':
    case 'INVALID_RANGE':
    case 'INVALID_START':
      return 'The selected segment is outside the video. Go back and adjust the scrubber.';
    case 'FILE_NOT_FOUND':
    case 'INVALID_URI':
      return 'The original video could not be read. Try picking it again.';
    default:
      return error instanceof Error && error.message
        ? error.message
        : 'Something went wrong while cropping the video.';
  }
}
