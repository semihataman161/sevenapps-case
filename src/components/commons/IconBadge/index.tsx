import { View } from 'react-native';

import { Icon } from '../Icon';
import type { IconBadgeProps } from './types';

export type * from './types';

export function IconBadge({
  icon,
  iconSize = 36,
  iconTone = 'accent',
  className = '',
  ...props
}: IconBadgeProps) {
  return (
    <View
      className={`h-20 w-20 items-center justify-center rounded-full bg-accent-soft dark:bg-surface-dark-muted ${className}`}
      {...props}
    >
      <Icon name={icon} size={iconSize} tone={iconTone} />
    </View>
  );
}
