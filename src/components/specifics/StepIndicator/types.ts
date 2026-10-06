import type { ViewProps } from 'react-native';

export type CropStep = 0 | 1 | 2;

export type StepIndicatorProps = ViewProps & {
  step: CropStep;
  className?: string;
};
