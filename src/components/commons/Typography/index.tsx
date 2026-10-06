import { Text } from 'react-native';

import type { TypographyProps, TypographyTone, TypographyVariant, TypographyWeight } from './types';

export type * from './types';

const variantClasses: Record<TypographyVariant, string> = {
  display: 'text-2xl',
  title: 'text-xl',
  body: 'text-base',
  label: 'text-sm',
  caption: 'text-xs',
  micro: 'text-[10px]',
  overline: 'text-xs tracking-wider',
};

const defaultWeights: Record<TypographyVariant, TypographyWeight> = {
  display: 'bold',
  title: 'bold',
  body: 'regular',
  label: 'regular',
  caption: 'regular',
  micro: 'semibold',
  overline: 'semibold',
};

const weightClasses: Record<TypographyWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const toneClasses: Record<TypographyTone, string> = {
  default: 'text-ink dark:text-white',
  muted: 'text-ink-muted',
  accent: 'text-accent',
  danger: 'text-red-600 dark:text-red-400',
  inverse: 'text-white',
};

export function Typography({
  variant = 'body',
  tone = 'default',
  weight,
  className = '',
  ...props
}: TypographyProps) {
  return (
    <Text
      className={`${variantClasses[variant]} ${weightClasses[weight ?? defaultWeights[variant]]} ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
