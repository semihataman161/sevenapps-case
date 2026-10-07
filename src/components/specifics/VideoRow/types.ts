import type { VideoEntryProps } from '../VideoEntry';

export type VideoRowProps = Omit<VideoEntryProps, 'video'> & {
  id: string;
};
