import type { ThemeColors } from '@/lib';

import type { IconTone } from './types';

export function toneColors(colors: ThemeColors): Record<IconTone, string> {
  return {
    default: colors.text,
    secondary: colors.secondary,
    muted: colors.muted,
    accent: colors.accent,
    danger: colors.accent,
    inverse: colors.inverse,
  };
}
