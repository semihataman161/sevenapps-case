import type { TextProps } from 'react-native';

export type TypographyVariant =
  'display' | 'title' | 'body' | 'label' | 'caption' | 'micro' | 'overline';

export type TypographyTone = 'default' | 'muted' | 'accent' | 'danger' | 'inverse';

export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TypographyProps = TextProps & {
  variant?: TypographyVariant;
  tone?: TypographyTone;
  weight?: TypographyWeight;
  className?: string;
};
