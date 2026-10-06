import type { PressableScaleProps } from '@/components/commons';
import type { DiaryVideo } from '@/types';

export type VideoCardProps = Omit<PressableScaleProps, 'children' | 'onPress'> & {
  video: DiaryVideo;
  onPress: (id: string) => void;
};
