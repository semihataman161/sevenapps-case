import { Pressable } from 'react-native';

import { Icon } from '../Icon';
import { Typography } from '../Typography';
import type { TextButtonProps } from './types';

export type * from './types';

export function TextButton({
  title,
  icon,
  iconSize = 22,
  tone = 'accent',
  variant = 'body',
  weight = 'regular',
  disabled,
  className = '',
  ...props
}: TextButtonProps) {
  return (
    <Pressable
      hitSlop={12}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      className={`flex-row items-center active:opacity-60 ${disabled ? 'opacity-40' : ''} ${className}`}
      {...props}
    >
      {icon ? <Icon name={icon} size={iconSize} tone={tone} /> : null}
      <Typography variant={variant} weight={weight} tone={tone}>
        {title}
      </Typography>
    </Pressable>
  );
}
