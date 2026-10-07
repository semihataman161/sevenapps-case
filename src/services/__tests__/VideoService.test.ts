import { videoErrorCode, VideoService, VideoServiceError } from '@/services/VideoService';
import type { VideoRecord, VideoServiceDependencies } from '@/services/VideoService';

const source = {
  uri: 'file:///picked.mov',
  duration: 30,
  width: 1280,
  height: 720,
  fileName: 'a.mov',
};

function makeStorage(folder: string, files: string[] = []) {
  return {
    list: jest.fn(() => files),
    uri: jest.fn((fileName: string) => `file:///docs/${folder}/${fileName}`),
    moveIn: jest.fn(async (_uri: string, fileName: string) => fileName),
    remove: jest.fn(),
  };
}

function makeService(overrides: Partial<VideoServiceDependencies> = {}) {
  const mocks = {
    repository: {
      count: jest.fn(async () => 0),
      getById: jest.fn(async (): Promise<VideoRecord | null> => null),
      getPage: jest.fn(async (): Promise<VideoRecord[]> => []),
      getFileNames: jest.fn(async (): Promise<string[]> => []),
      insert: jest.fn(async (_video: VideoRecord) => {}),
      updateDetails: jest.fn(async () => {}),
      remove: jest.fn(async () => {}),
    },
    videos: makeStorage('videos'),
    thumbnails: makeStorage('thumbnails'),
    trimmer: jest.fn(async () => ({ uri: 'file:///tmp/trimmed.mp4' })),
    thumbnailer: jest.fn(async () => ({ uri: 'file:///tmp/poster.jpg' })),
  };
  const service = new VideoService({
    ...mocks,
    createId: () => 'clip1',
    now: () => 1000,
    ...overrides,
  });
  return { service, deps: mocks };
}

function record(id: string): VideoRecord {
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
  };
}

describe('VideoService.crop', () => {
  beforeEach(() => jest.spyOn(console, 'warn').mockImplementation(() => {}));

  it('trims the range, stores the files and persists the record', async () => {
    const { service, deps } = makeService();
    const video = await service.crop({
      source,
      range: { start: 10, end: 15 },
      details: { name: ' Sunset ', description: ' Nice ' },
    });

    expect(deps.trimmer).toHaveBeenCalledWith({ uri: source.uri, start: 10, end: 15 });
    expect(deps.videos.moveIn).toHaveBeenCalledWith('file:///tmp/trimmed.mp4', 'clip1.mp4');
    expect(deps.thumbnailer).toHaveBeenCalledWith('file:///docs/videos/clip1.mp4');
    expect(video).toEqual({
      id: 'clip1',
      name: 'Sunset',
      description: 'Nice',
      fileName: 'clip1.mp4',
      thumbnailName: 'clip1.jpg',
      duration: 5,
      sourceStart: 10,
      width: 1280,
      height: 720,
      createdAt: 1000,
      updatedAt: 1000,
    });
    expect(deps.repository.insert).toHaveBeenCalledWith(video);
  });

  it('keeps going without a poster when the thumbnail fails', async () => {
    const { service } = makeService({
      thumbnailer: jest.fn(async () => {
        throw new Error('no frame');
      }),
    });
    const video = await service.crop({
      source,
      range: { start: 0, end: 5 },
      details: { name: 'Clip', description: '' },
    });
    expect(video.thumbnailName).toBeNull();
  });

  it('removes the written files if the database insert fails', async () => {
    const { service, deps } = makeService();
    deps.repository.insert.mockRejectedValueOnce(new Error('constraint failed'));

    await expect(
      service.crop({
        source,
        range: { start: 0, end: 5 },
        details: { name: 'Clip', description: '' },
      }),
    ).rejects.toThrow('constraint failed');
    expect(deps.videos.remove).toHaveBeenCalledWith('clip1.mp4');
    expect(deps.thumbnails.remove).toHaveBeenCalledWith('clip1.jpg');
  });

  it('does not touch storage when trimming fails', async () => {
    const { service, deps } = makeService({
      trimmer: jest.fn(async () => {
        throw Object.assign(new Error('bad'), { code: 'INVALID_END' });
      }),
    });

    await expect(
      service.crop({
        source,
        range: { start: 0, end: 5 },
        details: { name: 'Clip', description: '' },
      }),
    ).rejects.toThrow('bad');
    expect(deps.videos.moveIn).not.toHaveBeenCalled();
    expect(deps.repository.insert).not.toHaveBeenCalled();
  });
});

describe('VideoService records', () => {
  it('returns a page with a cursor when more records exist', async () => {
    const { service, deps } = makeService();
    const records = ['c', 'b', 'a'].map((id, index) => ({ ...record(id), createdAt: 30 - index }));
    deps.repository.getPage.mockResolvedValueOnce(records);

    const page = await service.listPage({ limit: 2 });
    expect(deps.repository.getPage).toHaveBeenCalledWith({ limit: 3, after: null });
    expect(page.videos.map((video) => video.id)).toEqual(['c', 'b']);
    expect(page.nextCursor).toEqual({ createdAt: 29, id: 'b' });
  });

  it('returns no cursor on the last page', async () => {
    const { service, deps } = makeService();
    deps.repository.getPage.mockResolvedValueOnce([record('a')]);

    const page = await service.listPage({ limit: 2, after: { createdAt: 5, id: 'x' } });
    expect(deps.repository.getPage).toHaveBeenCalledWith({
      limit: 3,
      after: { createdAt: 5, id: 'x' },
    });
    expect(page.nextCursor).toBeNull();
  });

  it('gets a single record by id', async () => {
    const { service, deps } = makeService();
    deps.repository.getById.mockResolvedValueOnce(record('a'));

    await expect(service.get('a')).resolves.toEqual(record('a'));
    expect(deps.repository.getById).toHaveBeenCalledWith('a');
  });

  it('counts records through the repository', async () => {
    const { service, deps } = makeService();
    deps.repository.count.mockResolvedValueOnce(7);
    await expect(service.count()).resolves.toBe(7);
  });

  it('removes files that no record references', async () => {
    const videos = makeStorage('videos', ['clip1.mp4', 'stray.mp4']);
    const thumbnails = makeStorage('thumbnails', ['clip1.jpg', 'stray.jpg']);
    const { service, deps } = makeService({ videos, thumbnails });
    deps.repository.getFileNames.mockResolvedValueOnce(['clip1.mp4', 'clip1.jpg']);

    await expect(service.removeOrphanedFiles()).resolves.toBe(2);
    expect(videos.remove).toHaveBeenCalledWith('stray.mp4');
    expect(thumbnails.remove).toHaveBeenCalledWith('stray.jpg');
    expect(videos.remove).not.toHaveBeenCalledWith('clip1.mp4');
  });

  it('trims details before updating them', async () => {
    const { service, deps } = makeService();
    const result = await service.updateDetails('clip1', { name: ' New ', description: ' Text ' });
    expect(result).toEqual({ details: { name: 'New', description: 'Text' }, updatedAt: 1000 });
    expect(deps.repository.updateDetails).toHaveBeenCalledWith(
      'clip1',
      { name: 'New', description: 'Text' },
      1000,
    );
  });

  it('deletes the record and its files', async () => {
    const { service, deps } = makeService();
    await service.delete({
      id: 'clip1',
      name: 'Clip',
      description: '',
      fileName: 'clip1.mp4',
      thumbnailName: null,
      duration: 5,
      sourceStart: 0,
      width: null,
      height: null,
      createdAt: 1,
      updatedAt: 1,
    });
    expect(deps.repository.remove).toHaveBeenCalledWith('clip1');
    expect(deps.videos.remove).toHaveBeenCalledWith('clip1.mp4');
    expect(deps.thumbnails.remove).not.toHaveBeenCalled();
  });

  it('resolves file locations through its storages', () => {
    const { service } = makeService();
    expect(service.videoUri('clip1.mp4')).toBe('file:///docs/videos/clip1.mp4');
    expect(service.thumbnailUri('clip1.jpg')).toBe('file:///docs/thumbnails/clip1.jpg');
    expect(service.thumbnailUri(null)).toBeNull();
  });
});

describe('videoErrorCode', () => {
  it('maps native error codes to service error codes', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(videoErrorCode({ code: 'INVALID_END' })).toBe('rangeOutOfBounds');
    expect(videoErrorCode({ code: 'FILE_NOT_FOUND' })).toBe('sourceUnreadable');
    expect(videoErrorCode(new VideoServiceError('notFound'))).toBe('notFound');
    expect(videoErrorCode(new Error('boom'))).toBe('unknown');
  });
});
