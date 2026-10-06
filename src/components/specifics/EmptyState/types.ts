import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

import type { IconName } from '@/types';

export type EmptyStateProps = ViewProps & {
  icon: IconName;
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
};
