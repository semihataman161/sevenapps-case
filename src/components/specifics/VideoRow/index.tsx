import { useVideo } from '@/stores';

import { VideoEntry } from '../VideoEntry';
import type { VideoRowProps } from './types';

export type * from './types';

export function VideoRow({ id, ...props }: VideoRowProps) {
  const video = useVideo(id);

  return video ? <VideoEntry video={video} {...props} /> : null;
}
