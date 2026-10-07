import { keyValueStorage, videoService } from '@/services';

import { ORPHAN_SWEEP_INTERVAL_MS, ORPHAN_SWEEP_KEY } from './constants';

export async function sweepOrphanedFilesIfDue(now: number = Date.now()): Promise<boolean> {
  const lastRun = Number(keyValueStorage.getItem(ORPHAN_SWEEP_KEY) ?? 0);
  if (now - lastRun < ORPHAN_SWEEP_INTERVAL_MS) return false;

  await videoService.removeOrphanedFiles();
  keyValueStorage.setItem(ORPHAN_SWEEP_KEY, String(now));
  return true;
}
