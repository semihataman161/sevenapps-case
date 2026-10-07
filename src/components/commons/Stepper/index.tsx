import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { formatIndex } from '@/lib';

import { Row } from '../Row';
import { Typography } from '../Typography';
import { PROGRESS_ANIMATION_MS } from './constants';
import { progressClasses } from './styles';
import type { StepperProps } from './types';

export type * from './types';

export function Stepper({ steps, current, className = '', ...props }: StepperProps) {
  const total = steps.length;
  const index = Math.min(Math.max(current, 0), Math.max(total - 1, 0));
  const doneStyle = useAnimatedStyle(() => ({
    flex: withTiming(index + 1, { duration: PROGRESS_ANIMATION_MS }),
  }));
  const restStyle = useAnimatedStyle(() => ({
    flex: withTiming(total - index - 1, { duration: PROGRESS_ANIMATION_MS }),
  }));

  return (
    <View className={className} {...props}>
      <Row justify="between" className="mb-3">
        <Row gap={6}>
          <Typography variant="overline" tabular>
            {formatIndex(index + 1)}
          </Typography>
          <Typography variant="overline" tone="muted" tabular>
            {`/ ${formatIndex(total)}`}
          </Typography>
        </Row>
        <Typography variant="overline" tone="secondary">
          {steps[index] ?? ''}
        </Typography>
      </Row>
      <View className="h-px flex-row">
        <Animated.View style={doneStyle} className={progressClasses.done} />
        <Animated.View style={restStyle} className={progressClasses.rest} />
      </View>
    </View>
  );
}
