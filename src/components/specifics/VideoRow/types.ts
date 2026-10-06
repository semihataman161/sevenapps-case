import type { VideoCardProps } from '../VideoCard';

export type VideoRowProps = Omit<VideoCardProps, 'video'> & {
  id: string;
};
