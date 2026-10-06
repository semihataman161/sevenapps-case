import type { ViewProps } from 'react-native';

export type SourcePickerProps = ViewProps & {
  onPicked: () => void;
  className?: string;
};
