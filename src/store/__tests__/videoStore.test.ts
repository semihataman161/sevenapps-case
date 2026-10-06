import type { DiaryVideo } from '@/types';

import { useVideoStore } from '@/store';

jest.mock('@/db', () => ({
  videoRepository: { getAll: jest.fn() },
}));

const { videoRepository } = jest.requireMock('@/db') as {
  videoRepository: { getAll: jest.Mock };
};

const makeVideo = (id: string, createdAt: number): DiaryVideo => ({
  id,
  name: `Clip ${id}`,
  description: '',
  fileName: `${id}.mp4`,
  thumbnailName: null,
  duration: 5,
  sourceStart: 0,
  width: null,
  height: null,
  createdAt,
  updatedAt: createdAt,
});

describe('useVideoStore', () => {
  beforeEach(() => useVideoStore.setState({ status: 'idle', error: null, ids: [], byId: {} }));

  it('hydrates from the repository, keeping its order', async () => {
    videoRepository.getAll.mockResolvedValue([makeVideo('b', 2), makeVideo('a', 1)]);
    await useVideoStore.getState().hydrate();
    expect(useVideoStore.getState().status).toBe('ready');
    expect(useVideoStore.getState().ids).toEqual(['b', 'a']);
  });

  it('records hydration errors', async () => {
    videoRepository.getAll.mockRejectedValue(new Error('disk full'));
    await useVideoStore.getState().hydrate();
    expect(useVideoStore.getState()).toMatchObject({ status: 'error', error: 'disk full' });
  });

  it('adds new videos to the top, updates and removes them', () => {
    const { add, updateMetadata, remove } = useVideoStore.getState();
    add(makeVideo('a', 1));
    add(makeVideo('b', 2));
    expect(useVideoStore.getState().ids).toEqual(['b', 'a']);

    updateMetadata('a', { name: 'Renamed', description: 'New' }, 99);
    expect(useVideoStore.getState().byId.a).toMatchObject({
      name: 'Renamed',
      description: 'New',
      updatedAt: 99,
    });

    remove('b');
    expect(useVideoStore.getState().ids).toEqual(['a']);
    expect(useVideoStore.getState().byId.b).toBeUndefined();
  });
});
