import { View } from 'react-native';

import { Typography, type TypographyTone, type TypographyVariant } from '../Typography';
import type { BadgeProps, BadgeTone } from './types';

export type * from './types';

const containerClasses: Record<BadgeTone, string> = {
  accent: 'rounded-full bg-accent-soft px-3 py-1 dark:bg-surface-dark-muted',
  overlay: 'rounded-md bg-black/60 px-1.5 py-0.5',
};

const textDefaults: Record<BadgeTone, { variant: TypographyVariant; tone: TypographyTone }> = {
  accent: { variant: 'caption', tone: 'accent' },
  overlay: { variant: 'micro', tone: 'inverse' },
};

export function Badge({
  label,
  tone = 'accent',
  textVariant,
  textWeight = 'semibold',
  className = '',
  ...props
}: BadgeProps) {
  const text = textDefaults[tone];

  return (
    <View className={`${containerClasses[tone]} ${className}`} {...props}>
      <Typography variant={textVariant ?? text.variant} weight={textWeight} tone={text.tone}>
        {label}
      </Typography>
    </View>
  );
}
