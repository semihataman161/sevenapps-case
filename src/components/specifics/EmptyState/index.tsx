import Animated, { FadeInDown } from 'react-native-reanimated';

import { IconBadge, Typography } from '@/components/commons';

import type { EmptyStateProps } from './types';

export type * from './types';

export function EmptyState({
  icon,
  title,
  message,
  action,
  className = '',
  ...props
}: EmptyStateProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      className={`items-center px-10 py-16 ${className}`}
      {...props}
    >
      <IconBadge icon={icon} className="mb-5" />
      <Typography variant="title" className="mb-2 text-center">
        {title}
      </Typography>
      <Typography tone="muted" className="mb-8 text-center leading-6">
        {message}
      </Typography>
      {action}
    </Animated.View>
  );
}
