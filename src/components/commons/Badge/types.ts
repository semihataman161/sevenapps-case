import type { ViewProps } from 'react-native';

import type { TypographyVariant, TypographyWeight } from '../Typography';

export type BadgeTone = 'accent' | 'overlay';

export type BadgeProps = ViewProps & {
  label: string;
  tone?: BadgeTone;
  textVariant?: TypographyVariant;
  textWeight?: TypographyWeight;
  className?: string;
};
