import type { ButtonSize, ButtonVariant, ButtonVariantStyle } from './types';

export const sizeClasses: Record<ButtonSize, string> = {
  regular: 'h-[52px] px-4',
  compact: 'h-10 px-3',
};

export const BOXED_DISABLED = { container: 'opacity-40', content: '' };

export const variants: Record<ButtonVariant, ButtonVariantStyle> = {
  primary: {
    boxed: true,
    container: `rounded justify-between bg-ink`,
    disabled: BOXED_DISABLED,
    text: 'inverse',
    icon: 'inverse',
    iconSize: 18,
    iconPosition: 'end',
    gap: 8,
    pressedOpacity: 0.75,
    spinner: 'inverse',
  },
  secondary: {
    boxed: true,
    container: `rounded justify-between border border-ink`,
    disabled: BOXED_DISABLED,
    text: 'default',
    icon: 'default',
    iconSize: 18,
    iconPosition: 'end',
    gap: 8,
    pressedOpacity: 0.6,
    spinner: 'default',
  },
  danger: {
    boxed: true,
    container: `rounded justify-between border border-accent`,
    disabled: BOXED_DISABLED,
    text: 'danger',
    icon: 'danger',
    iconSize: 18,
    iconPosition: 'end',
    gap: 8,
    pressedOpacity: 0.6,
    spinner: 'accent',
  },
  text: {
    boxed: false,
    container: '',
    disabled: { container: '', content: 'opacity-40' },
    text: 'default',
    icon: 'default',
    iconSize: 16,
    iconPosition: 'start',
    gap: 4,
    pressedOpacity: 0.5,
    hitSlop: 12,
    spinner: 'default',
  },
};
