import { sweepOrphanedFilesIfDue } from '@/setup/maintenance';

const DAY = 24 * 60 * 60 * 1000;

function makeDependencies(lastSweep?: number) {
  const values = new Map<string, string>();
  if (lastSweep !== undefined) values.set('video-diary/last-orphan-sweep', String(lastSweep));
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
    await expect(sweepOrphanedFilesIfDue(deps, DAY * 10)).resolves.toBe(true);
    expect(videos.removeOrphanedFiles).toHaveBeenCalledTimes(1);
    expect(values.get('video-diary/last-orphan-sweep')).toBe(String(DAY * 10));
  });

  it('skips when the last sweep was less than a day ago', async () => {
    const { deps, videos } = makeDependencies(DAY * 10);
    await expect(sweepOrphanedFilesIfDue(deps, DAY * 10 + 1000)).resolves.toBe(false);
    expect(videos.removeOrphanedFiles).not.toHaveBeenCalled();
  });

  it('sweeps again once a day has passed', async () => {
    const { deps } = makeDependencies(DAY * 10);
    await expect(sweepOrphanedFilesIfDue(deps, DAY * 11)).resolves.toBe(true);
  });
});
