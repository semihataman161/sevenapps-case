import type { ReactNode } from 'react';
import type { ScrollViewProps } from 'react-native';

export type KeyboardAwareScrollProps = ScrollViewProps & {
  children: ReactNode;
  contentContainerClassName?: string;
};
