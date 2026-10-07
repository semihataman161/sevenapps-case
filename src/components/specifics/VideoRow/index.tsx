import { useVideoStore } from '@/services';
import { selectVideo } from '@/stores';

import { VideoEntry } from '../VideoEntry';
import type { VideoRowProps } from './types';

export type * from './types';

export function VideoRow({ id, ...props }: VideoRowProps) {
  const video = useVideoStore(selectVideo(id));

  return video ? <VideoEntry video={video} {...props} /> : null;
}
