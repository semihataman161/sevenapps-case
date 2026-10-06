import { useVideo } from '@/store';

import { VideoCard } from '../VideoCard';
import type { VideoRowProps } from './types';

export type * from './types';

export function VideoRow({ id, onPress }: VideoRowProps) {
  const video = useVideo(id);
  return video ? <VideoCard video={video} onPress={onPress} /> : null;
}
