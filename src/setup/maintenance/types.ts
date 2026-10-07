import type { KeyValueStore, VideoService } from '@/services';

export type OrphanSweepDependencies = {
  videos: Pick<VideoService, 'removeOrphanedFiles'>;
  storage: Pick<KeyValueStore, 'getItem' | 'setItem'>;
};
