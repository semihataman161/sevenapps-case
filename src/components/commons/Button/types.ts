import type { IconName } from '@/types';

import type { PressableScaleProps } from '../PressableScale';
import type { TypographyVariant, TypographyWeight } from '../Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export type ButtonProps = Omit<PressableScaleProps, 'children'> & {
  title: string;
  variant?: ButtonVariant;
  icon?: IconName;
  loading?: boolean;
  textVariant?: TypographyVariant;
  textWeight?: TypographyWeight;
  iconSize?: number;
};
