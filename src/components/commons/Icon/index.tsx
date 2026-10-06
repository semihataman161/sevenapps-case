import { Ionicons } from '@expo/vector-icons';

import { useThemeColors } from '@/lib';

import type { IconProps } from './types';

export type * from './types';

export function Icon({ tone = 'default', color, size = 20, ...props }: IconProps) {
  const colors = useThemeColors();
  const toneColors = {
    default: colors.text,
    muted: colors.muted,
    accent: colors.accent,
    danger: colors.danger,
    inverse: '#ffffff',
  };

  return <Ionicons size={size} color={color ?? toneColors[tone]} {...props} />;
}
