import type { ReactNode } from 'react';

import type { RowProps } from '../Row';
import type { TypographyVariant, TypographyWeight } from '../Typography';

export type HeaderProps = RowProps & {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  titleVariant?: TypographyVariant;
  titleWeight?: TypographyWeight;
};
