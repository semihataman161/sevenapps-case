import type { VideoRecord, VideoSource } from '@/services';

export function buildVideo(overrides: Partial<VideoRecord> = {}): VideoRecord {
  const id = overrides.id ?? 'clip1';
  return {
    id,
    name: `Clip ${id}`,
    description: '',
    fileName: `${id}.mp4`,
    thumbnailName: null,
    duration: 5,
    sourceStart: 0,
    width: null,
    height: null,
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  };
}

export function buildSource(overrides: Partial<VideoSource> = {}): VideoSource {
  return {
    uri: 'file:///source.mov',
    duration: 30,
    width: 1280,
    height: 720,
    fileName: 'source.mov',
    ...overrides,
  };
}
