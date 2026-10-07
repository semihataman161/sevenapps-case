import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

export type EmptyStateAlign = 'start' | 'center';

export type EmptyStateProps = ViewProps & {
  eyebrow?: string;
  title: string;
  message?: string;
  action?: ReactNode;
  align?: EmptyStateAlign;
  className?: string;
};
