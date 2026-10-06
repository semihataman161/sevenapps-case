import { ActivityIndicator } from 'react-native';

import { useThemeColors } from '@/lib';

import { Icon, type IconTone } from '../Icon';
import { PressableScale } from '../PressableScale';
import { Row } from '../Row';
import { Typography, type TypographyTone } from '../Typography';
import type { ButtonProps, ButtonVariant } from './types';

export type * from './types';

const containerClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent dark:bg-accent',
  secondary: 'bg-surface-muted dark:bg-surface-dark-muted',
  danger: 'bg-red-50 dark:bg-red-950',
};

const contentTones: Record<ButtonVariant, { text: TypographyTone; icon: IconTone }> = {
  primary: { text: 'inverse', icon: 'inverse' },
  secondary: { text: 'default', icon: 'accent' },
  danger: { text: 'danger', icon: 'danger' },
};

export function Button({
  title,
  variant = 'primary',
  icon,
  loading = false,
  textVariant = 'body',
  textWeight = 'semibold',
  iconSize = 20,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;
  const tones = contentTones[variant];
  const spinnerColor = { primary: '#ffffff', secondary: colors.accent, danger: colors.danger };

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      pressedScale={0.97}
      className={`h-14 flex-row items-center justify-center rounded-2xl px-5 ${containerClasses[variant]} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor[variant]} />
      ) : (
        <Row gap={8}>
          {icon ? <Icon name={icon} size={iconSize} tone={tones.icon} /> : null}
          <Typography variant={textVariant} weight={textWeight} tone={tones.text}>
            {title}
          </Typography>
        </Row>
      )}
    </PressableScale>
  );
}
