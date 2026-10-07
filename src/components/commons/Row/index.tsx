import { View } from 'react-native';

import { cn } from '@/lib';

import { alignClasses, justifyClasses } from './styles';
import type { RowProps } from './types';

export type * from './types';

export function Row({
  gap = 0,
  align = 'center',
  justify = 'start',
  className = '',
  style,
  ...props
}: RowProps) {
  return (
    <View
      className={cn('flex-row', alignClasses[align], justifyClasses[justify], className)}
      style={[{ gap }, style]}
      {...props}
    />
  );
}
