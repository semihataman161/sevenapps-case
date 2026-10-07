import type { ViewProps } from 'react-native';

import type { SourceVideo } from '@/types';

export type TrimStepProps = ViewProps & {
  source: SourceVideo;
  onNext: () => void;
  active?: boolean;
  className?: string;
};
