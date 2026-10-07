import type { MediaItemProps } from '@/components/commons';
import type { CropJob } from '@/hooks';

export type CropJobRowProps = Omit<
  MediaItemProps,
  'title' | 'imageUri' | 'imageKey' | 'leading' | 'meta' | 'description' | 'footer'
> & {
  job: CropJob;
  onRetry: (id: number) => void;
  onDismiss: (id: number) => void;
};
