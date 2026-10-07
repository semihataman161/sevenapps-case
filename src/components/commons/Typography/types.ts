import type { TextProps } from 'react-native';

export type TypographyVariant =
  | 'display'
  | 'headline'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'label'
  | 'caption'
  | 'overline'
  | 'meta'
  | 'action'
  | 'micro';

export type TypographyTone = 'default' | 'secondary' | 'muted' | 'accent' | 'danger' | 'inverse';

export type TypographyWeight = 'regular' | 'medium' | 'semibold';

export type TypographyProps = TextProps & {
  variant?: TypographyVariant;
  tone?: TypographyTone;
  weight?: TypographyWeight;
  tabular?: boolean;
  maxChars?: number;
  className?: string;
};

export type TypographyScale = {
  serif: boolean;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  uppercase?: boolean;
  weight: TypographyWeight;
};
