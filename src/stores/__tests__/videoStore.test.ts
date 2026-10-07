import type { VideoRecord } from '@/services';

import { useVideoStore } from '@/stores';
import { INITIAL_VIDEO_STATE } from '@/stores/videoStore/constants';

jest.mock('@/services', () => ({
  videoService: { listPage: jest.fn(), count: jest.fn() },
  keyValueStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
}));

const { videoService } = jest.requireMock('@/services') as {
  videoService: { listPage: jest.Mock; count: jest.Mock };
};

const makeVideo = (id: string, createdAt: number): VideoRecord => ({
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
  beforeEach(() => {
    jest.clearAllMocks();
    useVideoStore.setState(INITIAL_VIDEO_STATE);
  });

  it('hydrates the first page and the total count', async () => {
    videoService.listPage.mockResolvedValue({
      videos: [makeVideo('c', 3), makeVideo('b', 2)],
      nextCursor: { createdAt: 2, id: 'b' },
    });
    videoService.count.mockResolvedValue(3);

    await useVideoStore.getState().hydrate();
    expect(useVideoStore.getState()).toMatchObject({
      status: 'ready',
      ids: ['c', 'b'],
      total: 3,
      nextCursor: { createdAt: 2, id: 'b' },
    });
  });

  it('loads the next page after the cursor', async () => {
    useVideoStore.setState({
      status: 'ready',
      ids: ['c', 'b'],
      byId: { c: makeVideo('c', 3), b: makeVideo('b', 2) },
      total: 3,
      nextCursor: { createdAt: 2, id: 'b' },
    });
    videoService.listPage.mockResolvedValue({ videos: [makeVideo('a', 1)], nextCursor: null });

    await useVideoStore.getState().loadMore();
    expect(videoService.listPage).toHaveBeenCalledWith({
      limit: 20,
      after: { createdAt: 2, id: 'b' },
      search: '',
    });
    expect(useVideoStore.getState()).toMatchObject({
      ids: ['c', 'b', 'a'],
      nextCursor: null,
      isLoadingMore: false,
    });
  });

  it('does not load more without a cursor', async () => {
    useVideoStore.setState({ status: 'ready', nextCursor: null });
    await useVideoStore.getState().loadMore();
    expect(videoService.listPage).not.toHaveBeenCalled();
  });

  it('replaces the list with search results', async () => {
    useVideoStore.setState({
      status: 'ready',
      ids: ['c', 'b'],
      byId: { c: makeVideo('c', 3), b: makeVideo('b', 2) },
      total: 3,
    });
    videoService.listPage.mockResolvedValue({ videos: [makeVideo('b', 2)], nextCursor: null });

    await useVideoStore.getState().search('sea');
    expect(videoService.listPage).toHaveBeenCalledWith({ limit: 20, search: 'sea' });
    expect(useVideoStore.getState()).toMatchObject({
      query: 'sea',
      ids: ['b'],
      total: 3,
      isSearching: false,
    });
  });

  it('ignores results of an outdated search', async () => {
    let resolveFirst: (value: unknown) => void = () => {};
    videoService.listPage
      .mockImplementationOnce(() => new Promise((resolve) => (resolveFirst = resolve)))
      .mockResolvedValueOnce({ videos: [makeVideo('b', 2)], nextCursor: null });

    const first = useVideoStore.getState().search('se');
    await useVideoStore.getState().search('sea');
    resolveFirst({ videos: [makeVideo('x', 9)], nextCursor: null });
    await first;

    expect(useVideoStore.getState()).toMatchObject({ query: 'sea', ids: ['b'] });
  });

  it('only shows new clips that match the current search', () => {
    useVideoStore.setState({ query: 'sea' });
    useVideoStore.getState().add({ ...makeVideo('a', 1), name: 'Mountain' });
    useVideoStore.getState().add({ ...makeVideo('b', 2), name: 'Seaside' });
    expect(useVideoStore.getState()).toMatchObject({ ids: ['b'], total: 2 });
  });

  it('records hydration errors', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    videoService.listPage.mockRejectedValue(new Error('disk full'));
    videoService.count.mockResolvedValue(0);
    await useVideoStore.getState().hydrate();
    expect(useVideoStore.getState().status).toBe('error');
  });

  it('adds, updates and removes videos while keeping the total in sync', () => {
    const { add, updateDetails, remove } = useVideoStore.getState();
    add(makeVideo('a', 1));
    add(makeVideo('b', 2));
    add(makeVideo('b', 2));
    expect(useVideoStore.getState()).toMatchObject({ ids: ['b', 'a'], total: 2 });

    updateDetails('a', { name: 'Renamed', description: 'New' }, 99);
    expect(useVideoStore.getState().byId.a).toMatchObject({
      name: 'Renamed',
      description: 'New',
      updatedAt: 99,
    });

    remove('b');
    remove('missing');
    expect(useVideoStore.getState()).toMatchObject({ ids: ['a'], total: 1 });
    expect(useVideoStore.getState().byId.b).toBeUndefined();
  });
});
