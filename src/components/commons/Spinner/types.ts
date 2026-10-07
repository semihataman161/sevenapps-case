import type { ActivityIndicatorProps } from 'react-native';

export type SpinnerTone = 'default' | 'secondary' | 'accent' | 'inverse';

export type SpinnerProps = Omit<ActivityIndicatorProps, 'color'> & {
  tone?: SpinnerTone;
};
