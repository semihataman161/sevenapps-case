import type { DiaryVideo } from '@/types';

export type VideoCardProps = {
  video: DiaryVideo;
  onPress: (id: string) => void;
};
