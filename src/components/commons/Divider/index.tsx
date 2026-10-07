import { View } from 'react-native';

import { cn } from '@/lib';

import type { DividerProps } from './types';

export type * from './types';

export function Divider({ className = '', ...props }: DividerProps) {
  return <View className={cn('h-px bg-rule', className)} {...props} />;
}
