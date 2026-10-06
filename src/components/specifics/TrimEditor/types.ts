import type { ViewProps } from 'react-native';

import type { SourceVideo } from '@/types';

export type TrimEditorProps = ViewProps & {
  source: SourceVideo;
  onNext: () => void;
  className?: string;
};
