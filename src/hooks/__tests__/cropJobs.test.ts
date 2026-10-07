import { MutationObserver, QueryClient } from '@tanstack/react-query';

import { isCropJob, toCropJob } from '@/hooks/useVideoMutations';
import { videoKeys } from '@/hooks/useVideoMutations/constants';
import type { CropVideoInput } from '@/hooks/useVideoMutations/types';

jest.mock('expo-haptics', () => ({}));
jest.mock('@/services', () => ({ videoErrorCode: () => 'unknown', useVideoStore: jest.fn() }));

const input = (name: string): CropVideoInput => ({
  source: { uri: `file:///${name}.mov`, duration: 10, width: 1080, height: 1920, fileName: null },
  start: 0,
  details: { name, description: '' },
});

const run = (client: QueryClient, name: string, mutationFn: () => Promise<unknown>) =>
  new MutationObserver<unknown, Error, CropVideoInput>(client, {
    mutationKey: videoKeys.crop(),
    mutationFn,
  })
    .mutate(input(name))
    .catch(() => {});

const jobs = (client: QueryClient) =>
  client
    .getMutationCache()
    .findAll({ mutationKey: videoKeys.crop(), predicate: isCropJob })
    .map(toCropJob);

describe('crop jobs', () => {
  it('lists pending and failed crops and leaves out finished ones', async () => {
    const client = new QueryClient();
    void run(client, 'Running', () => new Promise(() => {}));
    await run(client, 'Broken', () => Promise.reject(new Error('boom')));
    await run(client, 'Done', () => Promise.resolve({}));

    expect(jobs(client)).toEqual([
      { id: expect.any(Number), title: 'Running', status: 'pending', errorKey: null },
      { id: expect.any(Number), title: 'Broken', status: 'error', errorKey: 'errors.cropFailed' },
    ]);
  });
});
