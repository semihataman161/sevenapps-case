import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

export type PageHeaderProps = ViewProps & {
  title: string;
  meta?: ReactNode;
  topAction?: ReactNode;
  action?: ReactNode;
  className?: string;
};
