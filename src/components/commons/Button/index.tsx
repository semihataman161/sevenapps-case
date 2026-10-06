import { ActivityIndicator } from 'react-native';

import { useThemeColors } from '@/lib';

import { Icon } from '../Icon';
import { PressableScale } from '../PressableScale';
import { Row } from '../Row';
import { Typography } from '../Typography';
import type { ButtonProps, ButtonVariant, ButtonVariantStyle } from './types';

export type * from './types';

const BOXED = 'h-14 justify-center rounded-2xl px-5';
const BOXED_DISABLED = { container: 'opacity-50', content: '' };

const variants: Record<ButtonVariant, ButtonVariantStyle> = {
  primary: {
    container: `${BOXED} bg-accent dark:bg-accent`,
    disabled: BOXED_DISABLED,
    text: 'inverse',
    icon: 'inverse',
    weight: 'semibold',
    iconSize: 20,
    gap: 8,
    pressedScale: 0.97,
    pressedOpacity: 1,
    spinner: () => '#ffffff',
  },
  secondary: {
    container: `${BOXED} bg-surface-muted dark:bg-surface-dark-muted`,
    disabled: BOXED_DISABLED,
    text: 'default',
    icon: 'accent',
    weight: 'semibold',
    iconSize: 20,
    gap: 8,
    pressedScale: 0.97,
    pressedOpacity: 1,
    spinner: (colors) => colors.accent,
  },
  danger: {
    container: `${BOXED} bg-red-50 dark:bg-red-950`,
    disabled: BOXED_DISABLED,
    text: 'danger',
    icon: 'danger',
    weight: 'semibold',
    iconSize: 20,
    gap: 8,
    pressedScale: 0.97,
    pressedOpacity: 1,
    spinner: (colors) => colors.danger,
  },
  text: {
    container: '',
    disabled: { container: '', content: 'opacity-40' },
    text: 'accent',
    icon: 'accent',
    weight: 'regular',
    iconSize: 22,
    gap: 0,
    pressedScale: 1,
    pressedOpacity: 0.5,
    hitSlop: 12,
    spinner: (colors) => colors.accent,
  },
};

export function Button({
  title,
  variant = 'primary',
  icon,
  loading = false,
  textVariant = 'body',
  textWeight,
  iconSize,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const colors = useThemeColors();
  const style = variants[variant];
  const isDisabled = !!disabled || loading;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      hitSlop={style.hitSlop}
      pressedScale={style.pressedScale}
      pressedOpacity={style.pressedOpacity}
      className={`flex-row items-center ${style.container} ${
        isDisabled ? style.disabled.container : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={style.spinner(colors)} />
      ) : (
        <Row gap={style.gap} className={isDisabled ? style.disabled.content : ''}>
          {icon ? <Icon name={icon} size={iconSize ?? style.iconSize} tone={style.icon} /> : null}
          <Typography variant={textVariant} weight={textWeight ?? style.weight} tone={style.text}>
            {title}
          </Typography>
        </Row>
      )}
    </PressableScale>
  );
}
