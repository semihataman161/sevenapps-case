import type { ThemeColors } from '@/lib';

import type { SpinnerTone } from './types';

export function toneColors(colors: ThemeColors): Record<SpinnerTone, string> {
  return {
    default: colors.text,
    secondary: colors.secondary,
    accent: colors.accent,
    inverse: colors.inverse,
  };
}
