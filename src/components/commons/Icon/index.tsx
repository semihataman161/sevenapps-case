import { Ionicons } from '@expo/vector-icons';

import { useThemeColors } from '@/lib';

import { toneColors } from './styles';
import type { IconProps } from './types';

export type * from './types';

export function Icon({ tone = 'default', color, size = 18, ...props }: IconProps) {
  const colors = useThemeColors();

  return <Ionicons size={size} color={color ?? toneColors(colors)[tone]} {...props} />;
}
