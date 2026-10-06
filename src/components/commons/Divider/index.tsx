import { View } from 'react-native';

import type { DividerProps } from './types';

export type * from './types';

export function Divider({ className = '', ...props }: DividerProps) {
  return <View className={`h-px bg-black/5 dark:bg-white/10 ${className}`} {...props} />;
}
