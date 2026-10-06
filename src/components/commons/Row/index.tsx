import { View } from 'react-native';

import type { RowAlign, RowJustify, RowProps } from './types';

export type * from './types';

const alignClasses: Record<RowAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClasses: Record<RowJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

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
      className={`flex-row ${alignClasses[align]} ${justifyClasses[justify]} ${className}`}
      style={[{ gap }, style]}
      {...props}
    />
  );
}
