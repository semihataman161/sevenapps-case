import type { PressableProps } from 'react-native';

import type { IconName } from '@/types';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: ButtonVariant;
  icon?: IconName;
  loading?: boolean;
  className?: string;
};
