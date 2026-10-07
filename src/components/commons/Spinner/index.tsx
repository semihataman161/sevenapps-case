import { ActivityIndicator } from 'react-native';

import { useThemeColors } from '@/lib';

import { toneColors } from './styles';
import type { SpinnerProps } from './types';

export type * from './types';

export function Spinner({ tone = 'default', ...props }: SpinnerProps) {
  const colors = useThemeColors();

  return <ActivityIndicator color={toneColors(colors)[tone]} {...props} />;
}
