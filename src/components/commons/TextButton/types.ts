import type { PressableProps } from 'react-native';

import type { IconName } from '@/types';

import type { TypographyTone, TypographyVariant, TypographyWeight } from '../Typography';

export type TextButtonProps = Omit<PressableProps, 'children'> & {
  title: string;
  icon?: IconName;
  iconSize?: number;
  tone?: TypographyTone;
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  className?: string;
};
