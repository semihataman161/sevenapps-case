import type { VideoPage, VideoRecord } from '@/services';
import { createVideoStore, type VideoState } from '@/stores/videoStore';
import { buildVideo } from '@/testing';

function page(videos: VideoRecord[], nextCursor: VideoPage['nextCursor'] = null): VideoPage {
  return { videos, nextCursor };
}

function makeStore(state: Partial<VideoState> = {}) {
  const service = {
    listPage: jest.fn(async (): Promise<VideoPage> => page([])),
    count: jest.fn(async () => 0),
    get: jest.fn(async (): Promise<VideoRecord | null> => null),
  };
  const store = createVideoStore(service);
  store.setState(state);
  return { store, service };
}

function loaded(videos: VideoRecord[], state: Partial<VideoState> = {}): Partial<VideoState> {
  return {
    status: 'ready',
    ids: videos.map((video) => video.id),
    byId: Object.fromEntries(videos.map((video) => [video.id, video])),
    total: videos.length,
    ...state,
  };
}

const c = buildVideo({ id: 'c', createdAt: 3 });
const b = buildVideo({ id: 'b', createdAt: 2 });
const a = buildVideo({ id: 'a', createdAt: 1 });

describe('videoStore.hydrate', () => {
  it('loads the first page and the total count', async () => {
    const { store, service } = makeStore();
    service.listPage.mockResolvedValueOnce(page([c, b], { createdAt: 2, id: 'b' }));
    service.count.mockResolvedValueOnce(3);

    await store.getState().hydrate();

    expect(store.getState()).toMatchObject({
      status: 'ready',
      ids: ['c', 'b'],
      total: 3,
      nextCursor: { createdAt: 2, id: 'b' },
    });
  });

  it('ends in the error status when loading fails', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { store, service } = makeStore();
    service.listPage.mockRejectedValueOnce(new Error('disk full'));

    await store.getState().hydrate();

    expect(store.getState().status).toBe('error');
  });
});

describe('videoStore.loadMore', () => {
  it('appends the page after the cursor', async () => {
    const { store, service } = makeStore(loaded([c, b], { nextCursor: { createdAt: 2, id: 'b' } }));
    service.listPage.mockResolvedValueOnce(page([a]));

    await store.getState().loadMore();

    expect(service.listPage).toHaveBeenCalledWith({
      limit: 20,
      after: { createdAt: 2, id: 'b' },
      search: '',
    });
    expect(store.getState()).toMatchObject({
      ids: ['c', 'b', 'a'],
      nextCursor: null,
      isLoadingMore: false,
    });
  });

  it('does nothing on the last page', async () => {
    const { store, service } = makeStore(loaded([c], { nextCursor: null }));

    await store.getState().loadMore();

    expect(service.listPage).not.toHaveBeenCalled();
  });
});

describe('videoStore.search', () => {
  it('replaces the list with the results but keeps the total', async () => {
    const { store, service } = makeStore(loaded([c, b]));
    service.listPage.mockResolvedValueOnce(page([b]));

    await store.getState().search('sea');

    expect(service.listPage).toHaveBeenCalledWith({ limit: 20, search: 'sea' });
    expect(store.getState()).toMatchObject({
      query: 'sea',
      ids: ['b'],
      total: 2,
      isSearching: false,
    });
  });

  it('ignores the results of an outdated search', async () => {
    const { store, service } = makeStore(loaded([c, b]));
    let finishFirst: (value: VideoPage) => void = () => {};
    service.listPage
      .mockImplementationOnce(() => new Promise((resolve) => (finishFirst = resolve)))
      .mockResolvedValueOnce(page([b]));

    const first = store.getState().search('se');
    await store.getState().search('sea');
    finishFirst(page([c]));
    await first;

    expect(store.getState()).toMatchObject({ query: 'sea', ids: ['b'], isSearching: false });
  });
});

describe('videoStore.add', () => {
  it('puts a new clip first and counts it', () => {
    const { store } = makeStore(loaded([b]));

    store.getState().add(c);

    expect(store.getState()).toMatchObject({ ids: ['c', 'b'], total: 2 });
  });

  it('does not count the same clip twice', () => {
    const { store } = makeStore(loaded([b]));

    store.getState().add(b);

    expect(store.getState()).toMatchObject({ ids: ['b'], total: 1 });
  });

  it('counts but hides a clip that does not match the current search', () => {
    const { store } = makeStore(loaded([], { query: 'sea' }));

    store.getState().add(buildVideo({ id: 'm', name: 'Mountain' }));
    store.getState().add(buildVideo({ id: 's', name: 'Seaside' }));

    expect(store.getState()).toMatchObject({ ids: ['s'], total: 2 });
  });
});

describe('videoStore.updateDetails', () => {
  it('updates the details and update time of a loaded clip', () => {
    const { store } = makeStore(loaded([a]));

    store.getState().updateDetails('a', { name: 'Renamed', description: 'New' }, 99);

    expect(store.getState().byId.a).toMatchObject({
      name: 'Renamed',
      description: 'New',
      updatedAt: 99,
    });
  });
});

describe('videoStore.remove', () => {
  it('drops the clip from the list and the total', () => {
    const { store } = makeStore(loaded([b, a]));

    store.getState().remove('b');

    expect(store.getState()).toMatchObject({ ids: ['a'], total: 1 });
    expect(store.getState().byId.b).toBeUndefined();
  });

  it('ignores an unknown id', () => {
    const { store } = makeStore(loaded([a]));

    store.getState().remove('missing');

    expect(store.getState()).toMatchObject({ ids: ['a'], total: 1 });
  });
});

describe('videoStore.load', () => {
  it('caches a single clip without adding it to the list', async () => {
    const old = buildVideo({ id: 'old' });
    const { store, service } = makeStore(loaded([b]));
    service.get.mockResolvedValueOnce(old);

    await expect(store.getState().load('old')).resolves.toEqual(old);

    expect(store.getState().ids).toEqual(['b']);
    expect(store.getState().byId.old).toEqual(old);
  });

  it('leaves the cache alone for an unknown clip', async () => {
    const { store } = makeStore(loaded([b]));

    await expect(store.getState().load('missing')).resolves.toBeNull();

    expect(Object.keys(store.getState().byId)).toEqual(['b']);
  });
});
