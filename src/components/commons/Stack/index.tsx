import { View } from 'react-native';

import type { StackProps } from './types';

export type * from './types';

export function Stack({ gap = 0, className = '', style, ...props }: StackProps) {
  return <View className={className} style={[{ gap }, style]} {...props} />;
}
