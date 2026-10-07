import { Text } from 'react-native';

import { useUpperCase } from '@/i18n';
import { truncate } from '@/lib';

import { fontFamilyFor, scales, toneClasses } from './styles';
import type { TypographyProps } from './types';

export type * from './types';

export function Typography({
  variant = 'body',
  tone = 'default',
  weight,
  tabular = false,
  maxChars,
  className = '',
  style,
  children,
  ...props
}: TypographyProps) {
  const upper = useUpperCase();
  const scale = scales[variant];
  const fontFamily = fontFamilyFor(scale, weight);
  const text =
    maxChars !== undefined && typeof children === 'string'
      ? truncate(children, maxChars)
      : children;
  const content = scale.uppercase && typeof text === 'string' ? upper(text) : text;

  return (
    <Text
      className={`${toneClasses[tone]} ${className}`}
      style={[
        {
          fontFamily,
          fontSize: scale.fontSize,
          lineHeight: scale.lineHeight,
          letterSpacing: scale.letterSpacing,
          fontVariant: tabular ? ['tabular-nums'] : undefined,
        },
        style,
      ]}
      {...props}
    >
      {content}
    </Text>
  );
}
