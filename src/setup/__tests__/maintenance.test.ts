import { sweepOrphanedFilesIfDue } from '@/setup/maintenance';
import { ORPHAN_SWEEP_KEY } from '@/setup/maintenance/constants';

const DAY = 24 * 60 * 60 * 1000;

function makeDependencies(lastSweep?: number) {
  const values = new Map<string, string>();
  if (lastSweep !== undefined) values.set(ORPHAN_SWEEP_KEY, String(lastSweep));
  const videos = { removeOrphanedFiles: jest.fn(async () => 0) };
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  };
  return { deps: { videos, storage }, videos, values };
}

describe('sweepOrphanedFilesIfDue', () => {
  it('sweeps on the first run and remembers when', async () => {
    const { deps, videos, values } = makeDependencies();

    const swept = await sweepOrphanedFilesIfDue(deps, DAY * 10);

    expect(swept).toBe(true);
    expect(videos.removeOrphanedFiles).toHaveBeenCalledTimes(1);
    expect(values.get(ORPHAN_SWEEP_KEY)).toBe(String(DAY * 10));
  });

  it('skips when the last sweep was less than a day ago', async () => {
    const { deps, videos } = makeDependencies(DAY * 10);

    const swept = await sweepOrphanedFilesIfDue(deps, DAY * 11 - 1);

    expect(swept).toBe(false);
    expect(videos.removeOrphanedFiles).not.toHaveBeenCalled();
  });

  it('sweeps again once a full day has passed', async () => {
    const { deps, videos } = makeDependencies(DAY * 10);

    const swept = await sweepOrphanedFilesIfDue(deps, DAY * 11);

    expect(swept).toBe(true);
    expect(videos.removeOrphanedFiles).toHaveBeenCalledTimes(1);
  });

  it('does not record a sweep that failed', async () => {
    const { deps, videos, values } = makeDependencies();
    videos.removeOrphanedFiles.mockRejectedValueOnce(new Error('io'));

    await expect(sweepOrphanedFilesIfDue(deps, DAY * 10)).rejects.toThrow('io');

    expect(values.has(ORPHAN_SWEEP_KEY)).toBe(false);
  });
});
