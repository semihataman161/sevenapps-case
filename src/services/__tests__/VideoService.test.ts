import { videoErrorCode, VideoService, VideoServiceError } from '@/services/VideoService';
import type { VideoRecord, VideoServiceDependencies } from '@/services/VideoService';
import { buildSource, buildVideo } from '@/testing';

function fakeStorage(folder: string, files: string[] = []) {
  return {
    list: jest.fn(() => files),
    uri: jest.fn((fileName: string) => `file:///docs/${folder}/${fileName}`),
    moveIn: jest.fn(async (_uri: string, fileName: string) => fileName),
    remove: jest.fn(),
  };
}

function makeService(overrides: Partial<VideoServiceDependencies> = {}) {
  const deps = {
    repository: {
      count: jest.fn(async () => 0),
      getById: jest.fn(async (): Promise<VideoRecord | null> => null),
      getPage: jest.fn(async (): Promise<VideoRecord[]> => []),
      getFileNames: jest.fn(async (): Promise<string[]> => []),
      insert: jest.fn(async (_video: VideoRecord) => {}),
      updateDetails: jest.fn(async () => {}),
      remove: jest.fn(async () => {}),
    },
    videos: fakeStorage('videos'),
    thumbnails: fakeStorage('thumbnails'),
    trimmer: jest.fn(async () => ({ uri: 'file:///tmp/trimmed.mp4' })),
    thumbnailer: jest.fn(async () => ({ uri: 'file:///tmp/poster.jpg' })),
  };
  const service = new VideoService({
    ...deps,
    createId: () => 'clip1',
    now: () => 1000,
    ...overrides,
  });
  return { service, deps };
}

const cropRequest = {
  source: buildSource(),
  range: { start: 10, end: 15 },
  details: { name: ' Sunset ', description: ' Nice ' },
};

describe('VideoService.crop', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('trims the range, stores the clip and poster, and saves a trimmed record', async () => {
    const { service, deps } = makeService();

    const video = await service.crop(cropRequest);

    expect(deps.trimmer).toHaveBeenCalledWith({ uri: 'file:///source.mov', start: 10, end: 15 });
    expect(deps.videos.moveIn).toHaveBeenCalledWith('file:///tmp/trimmed.mp4', 'clip1.mp4');
    expect(deps.thumbnailer).toHaveBeenCalledWith('file:///docs/videos/clip1.mp4');
    expect(video).toEqual(
      buildVideo({
        name: 'Sunset',
        description: 'Nice',
        thumbnailName: 'clip1.jpg',
        sourceStart: 10,
        width: 1280,
        height: 720,
        createdAt: 1000,
        updatedAt: 1000,
      }),
    );
    expect(deps.repository.insert).toHaveBeenCalledWith(video);
  });

  it('saves the clip without a poster when the poster fails', async () => {
    const thumbnailer = jest.fn().mockRejectedValue(new Error('no frame'));
    const { service } = makeService({ thumbnailer });

    const video = await service.crop(cropRequest);

    expect(video.thumbnailName).toBeNull();
  });

  it('removes the written files when saving the record fails', async () => {
    const { service, deps } = makeService();
    deps.repository.insert.mockRejectedValueOnce(new Error('constraint failed'));

    await expect(service.crop(cropRequest)).rejects.toThrow('constraint failed');

    expect(deps.videos.remove).toHaveBeenCalledWith('clip1.mp4');
    expect(deps.thumbnails.remove).toHaveBeenCalledWith('clip1.jpg');
  });

  it('writes nothing when trimming fails', async () => {
    const trimmer = jest.fn().mockRejectedValue(new Error('bad range'));
    const { service, deps } = makeService({ trimmer });

    await expect(service.crop(cropRequest)).rejects.toThrow('bad range');

    expect(deps.videos.moveIn).not.toHaveBeenCalled();
    expect(deps.repository.insert).not.toHaveBeenCalled();
  });
});

describe('VideoService.listPage', () => {
  it('asks for one extra record and returns a cursor when there are more', async () => {
    const { service, deps } = makeService();
    deps.repository.getPage.mockResolvedValueOnce([
      buildVideo({ id: 'c', createdAt: 30 }),
      buildVideo({ id: 'b', createdAt: 29 }),
      buildVideo({ id: 'a', createdAt: 28 }),
    ]);

    const page = await service.listPage({ limit: 2 });

    expect(deps.repository.getPage).toHaveBeenCalledWith({ limit: 3, after: null });
    expect(page.videos.map((video) => video.id)).toEqual(['c', 'b']);
    expect(page.nextCursor).toEqual({ createdAt: 29, id: 'b' });
  });

  it('returns no cursor on the last page', async () => {
    const { service, deps } = makeService();
    deps.repository.getPage.mockResolvedValueOnce([buildVideo({ id: 'a' })]);

    const page = await service.listPage({ limit: 2, after: { createdAt: 5, id: 'x' } });

    expect(page.nextCursor).toBeNull();
  });
});

describe('VideoService.updateDetails', () => {
  it('trims the details and stamps the update time', async () => {
    const { service, deps } = makeService();

    const result = await service.updateDetails('clip1', { name: ' New ', description: ' Text ' });

    expect(result).toEqual({ details: { name: 'New', description: 'Text' }, updatedAt: 1000 });
    expect(deps.repository.updateDetails).toHaveBeenCalledWith(
      'clip1',
      { name: 'New', description: 'Text' },
      1000,
    );
  });
});

describe('VideoService.delete', () => {
  it('deletes the record and the files it has', async () => {
    const { service, deps } = makeService();

    await service.delete(buildVideo({ thumbnailName: null }));

    expect(deps.repository.remove).toHaveBeenCalledWith('clip1');
    expect(deps.videos.remove).toHaveBeenCalledWith('clip1.mp4');
    expect(deps.thumbnails.remove).not.toHaveBeenCalled();
  });

  it('keeps the files when the record cannot be deleted', async () => {
    const { service, deps } = makeService();
    deps.repository.remove.mockRejectedValueOnce(new Error('busy'));

    await expect(service.delete(buildVideo())).rejects.toThrow('busy');

    expect(deps.videos.remove).not.toHaveBeenCalled();
  });
});

describe('VideoService.removeOrphanedFiles', () => {
  it('removes only files that no record references', async () => {
    const videos = fakeStorage('videos', ['clip1.mp4', 'stray.mp4']);
    const thumbnails = fakeStorage('thumbnails', ['clip1.jpg', 'stray.jpg']);
    const { service, deps } = makeService({ videos, thumbnails });
    deps.repository.getFileNames.mockResolvedValueOnce(['clip1.mp4', 'clip1.jpg']);

    const removed = await service.removeOrphanedFiles();

    expect(removed).toBe(2);
    expect(videos.remove).toHaveBeenCalledTimes(1);
    expect(videos.remove).toHaveBeenCalledWith('stray.mp4');
    expect(thumbnails.remove).toHaveBeenCalledTimes(1);
    expect(thumbnails.remove).toHaveBeenCalledWith('stray.jpg');
  });
});

describe('VideoService.thumbnailUri', () => {
  it('returns null for a clip without a poster', () => {
    const { service } = makeService();

    expect(service.thumbnailUri(null)).toBeNull();
  });
});

describe('videoErrorCode', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it.each([
    ['INVALID_END', 'rangeOutOfBounds'],
    ['INVALID_START', 'rangeOutOfBounds'],
    ['FILE_NOT_FOUND', 'sourceUnreadable'],
    ['INVALID_URI', 'sourceUnreadable'],
  ])('maps the native code %s to %s', (code, expected) => {
    expect(videoErrorCode({ code })).toBe(expected);
  });

  it('keeps the code of a service error', () => {
    expect(videoErrorCode(new VideoServiceError('notFound'))).toBe('notFound');
  });

  it.each([new Error('boom'), null, 'text'])('reports %p as unknown', (error) => {
    expect(videoErrorCode(error)).toBe('unknown');
  });
});
