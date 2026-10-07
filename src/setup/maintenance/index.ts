import { ORPHAN_SWEEP_INTERVAL_MS, ORPHAN_SWEEP_KEY } from './constants';
import type { OrphanSweepDependencies } from './types';

export type * from './types';

export async function sweepOrphanedFilesIfDue(
  { videos, storage }: OrphanSweepDependencies,
  now: number = Date.now(),
): Promise<boolean> {
  const lastRun = Number(storage.getItem(ORPHAN_SWEEP_KEY) ?? 0);
  if (now - lastRun < ORPHAN_SWEEP_INTERVAL_MS) return false;

  await videos.removeOrphanedFiles();
  storage.setItem(ORPHAN_SWEEP_KEY, String(now));
  return true;
}
