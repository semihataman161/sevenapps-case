import { View } from 'react-native';

import type { CardProps } from './types';

export type * from './types';

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <View
      className={`rounded-3xl bg-surface-muted dark:bg-surface-dark-muted ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
