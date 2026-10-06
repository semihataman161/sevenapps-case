import type { ThemeColors } from '@/lib';
import type { IconName } from '@/types';

import type { IconTone } from '../Icon';
import type { PressableScaleProps } from '../PressableScale';
import type { TypographyTone, TypographyVariant, TypographyWeight } from '../Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text';

export type ButtonProps = Omit<PressableScaleProps, 'children'> & {
  title: string;
  variant?: ButtonVariant;
  icon?: IconName;
  loading?: boolean;
  textVariant?: TypographyVariant;
  textWeight?: TypographyWeight;
  iconSize?: number;
};

export type ButtonVariantStyle = {
  container: string;
  disabled: { container: string; content: string };
  text: TypographyTone;
  icon: IconTone;
  weight: TypographyWeight;
  iconSize: number;
  gap: number;
  pressedScale: number;
  pressedOpacity: number;
  hitSlop?: number;
  spinner: (colors: ThemeColors) => string;
};
