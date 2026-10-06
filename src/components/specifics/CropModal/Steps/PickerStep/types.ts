import type { ViewProps } from 'react-native';

export type PickerStepProps = ViewProps & {
  onPicked: () => void;
  className?: string;
};
