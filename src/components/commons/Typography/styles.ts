import { FONTS } from '@/lib';

import type { TypographyScale, TypographyTone, TypographyVariant, TypographyWeight } from './types';

export const scales: Record<TypographyVariant, TypographyScale> = {
  display: { serif: true, fontSize: 46, lineHeight: 50, letterSpacing: -0.5, weight: 'regular' },
  headline: { serif: true, fontSize: 32, lineHeight: 36, letterSpacing: -0.3, weight: 'regular' },
  title: { serif: true, fontSize: 24, lineHeight: 29, letterSpacing: -0.2, weight: 'regular' },
  subtitle: { serif: true, fontSize: 19, lineHeight: 24, weight: 'regular' },
  body: { serif: false, fontSize: 15, lineHeight: 23, weight: 'regular' },
  label: { serif: false, fontSize: 13, lineHeight: 18, weight: 'regular' },
  caption: { serif: false, fontSize: 12, lineHeight: 16, weight: 'regular' },
  overline: {
    serif: false,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    uppercase: true,
    weight: 'medium',
  },
  meta: {
    serif: false,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1.2,
    uppercase: true,
    weight: 'medium',
  },
  action: {
    serif: false,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    uppercase: true,
    weight: 'semibold',
  },
  micro: {
    serif: false,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.8,
    uppercase: true,
    weight: 'medium',
  },
};

export const sansFamilies: Record<TypographyWeight, string> = {
  regular: FONTS.sans,
  medium: FONTS.sansMedium,
  semibold: FONTS.sansSemibold,
};

export const toneClasses: Record<TypographyTone, string> = {
  default: 'text-ink dark:text-ink-dark',
  secondary: 'text-secondary dark:text-secondary-dark',
  muted: 'text-muted dark:text-muted-dark',
  accent: 'text-accent dark:text-accent-dark',
  danger: 'text-accent dark:text-accent-dark',
  inverse: 'text-paper dark:text-paper-dark',
};

export function fontFamilyFor(scale: TypographyScale, weight?: TypographyWeight): string {
  return scale.serif ? FONTS.serif : sansFamilies[weight ?? scale.weight];
}
