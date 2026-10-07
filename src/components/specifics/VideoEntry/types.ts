import type { MediaItemProps } from '@/components/commons';
import type { DiaryVideo } from '@/types';

export type VideoEntryProps = Omit<
  MediaItemProps,
  'title' | 'imageUri' | 'imageKey' | 'meta' | 'description' | 'onPress'
> & {
  video: DiaryVideo;
  onPress: (id: string) => void;
};
