import type { MediaPickerContract, VideoService } from '@/services';

export type VideoServiceFake = jest.Mocked<
  Pick<
    VideoService,
    'listPage' | 'count' | 'get' | 'crop' | 'updateDetails' | 'delete' | 'videoUri' | 'thumbnailUri'
  >
>;

export type MediaPickerFake = jest.Mocked<MediaPickerContract>;

export function createServicesMock() {
  const videoModule =
    jest.requireActual<typeof import('@/services/VideoService')>('@/services/VideoService');
  const { createVideoStore } =
    jest.requireActual<typeof import('@/stores/videoStore')>('@/stores/videoStore');
  const videoService: VideoServiceFake = {
    listPage: jest.fn(),
    count: jest.fn(),
    get: jest.fn(),
    crop: jest.fn(),
    updateDetails: jest.fn(),
    delete: jest.fn(),
    videoUri: jest.fn(),
    thumbnailUri: jest.fn(),
  };
  const mediaPicker: MediaPickerFake = { pickVideo: jest.fn() };
  return {
    ...videoModule,
    videoService,
    mediaPicker,
    useVideoStore: createVideoStore(videoService),
  };
}

export type ServicesMock = ReturnType<typeof createServicesMock>;
