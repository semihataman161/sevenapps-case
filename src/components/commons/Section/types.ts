import type { ViewProps } from 'react-native';

import type { TypographyTone, TypographyVariant, TypographyWeight } from '../Typography';

export type SectionProps = ViewProps & {
  title?: string;
  titleVariant?: TypographyVariant;
  titleTone?: TypographyTone;
  titleWeight?: TypographyWeight;
  className?: string;
};
