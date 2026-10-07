import type { ViewProps } from 'react-native';

export type ErrorScreenProps = ViewProps & {
  onRetry: () => void;
  className?: string;
};
