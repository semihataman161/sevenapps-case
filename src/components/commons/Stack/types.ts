import type { ViewProps } from 'react-native';

export type StackProps = ViewProps & {
  gap?: number;
  className?: string;
};
