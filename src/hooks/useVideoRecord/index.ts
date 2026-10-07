import { useQuery } from '@tanstack/react-query';

import { useVideo, useVideoStore } from '@/stores';

import { videoKeys } from '../useVideoMutations/constants';
import type { VideoRecordResult } from './types';

export type * from './types';

export function useVideoRecord(id: string): VideoRecordResult {
  const video = useVideo(id);
  const isSettled = useVideoStore((s) => s.status === 'ready' || s.status === 'error');
  const load = useVideoStore((s) => s.load);

  const { isPending } = useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: () => load(id),
    enabled: !video && isSettled,
    retry: false,
  });

  return { video, isLoading: !video && (!isSettled || isPending) };
}
