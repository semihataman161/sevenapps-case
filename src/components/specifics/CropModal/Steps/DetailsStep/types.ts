import type { KeyboardAwareScrollProps } from '@/components/commons';
import type { SourceVideo } from '@/types';

export type DetailsStepProps = Omit<KeyboardAwareScrollProps, 'children'> & {
  source: SourceVideo;
  onComplete: () => void;
};
