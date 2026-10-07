import type { IconName } from '@/types';

import type { IconTone } from '../Icon';
import type { SpinnerTone } from '../Spinner';
import type { TouchableProps } from '../Touchable';
import type { TypographyTone, TypographyVariant, TypographyWeight } from '../Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text';

export type ButtonIconPosition = 'start' | 'end';

export type ButtonSize = 'regular' | 'compact';

export type ButtonProps = Omit<TouchableProps, 'children'> & {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: ButtonIconPosition;
  loading?: boolean;
  textVariant?: TypographyVariant;
  textTone?: TypographyTone;
  textWeight?: TypographyWeight;
  iconSize?: number;
};

export type ButtonVariantStyle = {
  boxed: boolean;
  container: string;
  disabled: { container: string; content: string };
  text: TypographyTone;
  icon: IconTone;
  iconSize: number;
  iconPosition: ButtonIconPosition;
  gap: number;
  pressedOpacity: number;
  hitSlop?: number;
  spinner: SpinnerTone;
};
