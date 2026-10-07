import type { KeyboardAwareScrollProps } from '@/components/commons';
import type { VideoSource } from '@/services';

export type DetailsStepProps = Omit<KeyboardAwareScrollProps, 'children'> & {
  source: VideoSource;
  onComplete: () => void;
};
