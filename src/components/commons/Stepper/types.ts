import type { ViewProps } from 'react-native';

export type StepperProps = ViewProps & {
  steps: readonly string[];
  current: number;
  className?: string;
};
