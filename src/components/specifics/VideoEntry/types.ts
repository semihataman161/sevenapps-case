import type { MediaItemProps } from '@/components/commons';
import type { VideoRecord } from '@/services';

export type VideoEntryProps = Omit<
  MediaItemProps,
  'title' | 'imageUri' | 'imageKey' | 'meta' | 'description' | 'onPress'
> & {
  video: VideoRecord;
  onPress: (id: string) => void;
};
