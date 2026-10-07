import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { cn } from '@/lib';

import { Typography } from '@/components/commons';

import { alignClasses } from './styles';
import type { EmptyStateProps } from './types';

export type * from './types';

export function EmptyState({
  eyebrow,
  title,
  message,
  action,
  align = 'start',
  className = '',
  ...props
}: EmptyStateProps) {
  const classes = alignClasses[align];

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className={cn(classes.container, className)}
      {...props}
    >
      {eyebrow ? (
        <Typography variant="overline" tone="accent" className={cn('mb-4', classes.text)}>
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="headline" className={cn('max-w-[320px]', classes.text)}>
        {title}
      </Typography>
      {message ? (
        <Typography tone="secondary" className={cn('mt-3 max-w-[300px]', classes.text)}>
          {message}
        </Typography>
      ) : null}
      {action ? <View className="mt-8">{action}</View> : null}
    </Animated.View>
  );
}
