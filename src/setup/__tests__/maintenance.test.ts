import { sweepOrphanedFilesIfDue } from '@/setup/maintenance';

const mockValues = new Map<string, string>();
const mockRemoveOrphanedFiles = jest.fn(async () => 0);

jest.mock('@/services', () => ({
  keyValueStorage: {
    getItem: (key: string) => mockValues.get(key) ?? null,
    setItem: (key: string, value: string) => void mockValues.set(key, value),
  },
  videoService: { removeOrphanedFiles: () => mockRemoveOrphanedFiles() },
}));

const DAY = 24 * 60 * 60 * 1000;

describe('sweepOrphanedFilesIfDue', () => {
  beforeEach(() => {
    mockValues.clear();
    mockRemoveOrphanedFiles.mockClear();
  });

  it('sweeps on the first run and remembers when', async () => {
    await expect(sweepOrphanedFilesIfDue(DAY * 10)).resolves.toBe(true);
    expect(mockRemoveOrphanedFiles).toHaveBeenCalledTimes(1);
    expect(mockValues.get('video-diary/last-orphan-sweep')).toBe(String(DAY * 10));
  });

  it('skips when the last sweep was less than a day ago', async () => {
    mockValues.set('video-diary/last-orphan-sweep', String(DAY * 10));
    await expect(sweepOrphanedFilesIfDue(DAY * 10 + 1000)).resolves.toBe(false);
    expect(mockRemoveOrphanedFiles).not.toHaveBeenCalled();
  });

  it('sweeps again once a day has passed', async () => {
    mockValues.set('video-diary/last-orphan-sweep', String(DAY * 10));
    await expect(sweepOrphanedFilesIfDue(DAY * 11)).resolves.toBe(true);
  });
});
