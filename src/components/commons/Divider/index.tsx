import { View } from 'react-native';

import type { DividerProps } from './types';

export type * from './types';

export function Divider({ className = '', ...props }: DividerProps) {
  return <View className={`h-px bg-rule dark:bg-rule-dark ${className}`} {...props} />;
}
