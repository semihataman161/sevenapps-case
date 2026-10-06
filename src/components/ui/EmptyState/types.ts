import type { ReactNode } from 'react';

import type { IconName } from '@/types';

export type EmptyStateProps = {
  icon: IconName;
  title: string;
  message: string;
  action?: ReactNode;
};
