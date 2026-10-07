import type { ViewProps } from 'react-native';

import type { VideoSource } from '@/services';

export type TrimStepProps = ViewProps & {
  source: VideoSource;
  onNext: () => void;
  active?: boolean;
  className?: string;
};
