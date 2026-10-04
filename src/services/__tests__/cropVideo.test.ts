import { cropVideo, describeCropError } from '../cropVideo';

jest.mock('expo-trim-video', () => ({ trimVideo: jest.fn() }));
jest.mock('@/db/videoRepository', () => ({ videoRepository: { insert: jest.fn() } }));
jest.mock('../videoFiles', () => ({
  persistClip: jest.fn(async (_uri: string, id: string) => `${id}.mp4`),
  createThumbnail: jest.fn(async (_uri: string, id: string) => `${id}.jpg`),
  deleteFiles: jest.fn(),
  videoUri: (name: string) => `file:///docs/videos/${name}`,
}));

const { trimVideo } = jest.requireMock('expo-trim-video') as { trimVideo: jest.Mock };
const { videoRepository } = jest.requireMock('@/db/videoRepository') as {
  videoRepository: { insert: jest.Mock };
};
const files = jest.requireMock('../videoFiles') as { deleteFiles: jest.Mock };

const source = {
  uri: 'file:///picked.mov',
  duration: 30,
  width: 1280,
  height: 720,
  fileName: 'a.mov',
};

describe('cropVideo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    trimVideo.mockResolvedValue({ uri: 'file:///tmp/trimmed.mp4' });
  });

  it('trims a 5s segment, stores the files and persists the row', async () => {
    const video = await cropVideo({
      source,
      start: 10,
      metadata: { name: ' Sunset ', description: ' Nice ' },
    });

    expect(trimVideo).toHaveBeenCalledWith({ uri: source.uri, start: 10, end: 15 });
    expect(video).toMatchObject({
      name: 'Sunset',
      description: 'Nice',
      duration: 5,
      sourceStart: 10,
      fileName: `${video.id}.mp4`,
      thumbnailName: `${video.id}.jpg`,
    });
    expect(videoRepository.insert).toHaveBeenCalledWith(video);
  });

  it('cleans up the written files if the database insert fails', async () => {
    videoRepository.insert.mockRejectedValueOnce(new Error('constraint failed'));
    await expect(
      cropVideo({ source, start: 0, metadata: { name: 'Clip', description: '' } }),
    ).rejects.toThrow('constraint failed');
    expect(files.deleteFiles).toHaveBeenCalledTimes(1);
  });

  it('does not touch storage when trimming fails', async () => {
    trimVideo.mockRejectedValueOnce(Object.assign(new Error('bad'), { code: 'INVALID_END' }));
    await expect(
      cropVideo({ source, start: 0, metadata: { name: 'Clip', description: '' } }),
    ).rejects.toThrow('bad');
    expect(videoRepository.insert).not.toHaveBeenCalled();
  });
});

describe('describeCropError', () => {
  it('maps native error codes to friendly messages', () => {
    expect(describeCropError({ code: 'INVALID_END' })).toMatch(/adjust the scrubber/);
    expect(describeCropError({ code: 'FILE_NOT_FOUND' })).toMatch(/picking it again/);
    expect(describeCropError(new Error('boom'))).toBe('boom');
  });
});
