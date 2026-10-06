import { useVideo } from '@/store';

import { VideoCard } from '../VideoCard';
import type { VideoRowProps } from './types';

export type * from './types';

export function VideoRow({ id, ...props }: VideoRowProps) {
  const video = useVideo(id);

  return video ? <VideoCard video={video} {...props} /> : null;
}
