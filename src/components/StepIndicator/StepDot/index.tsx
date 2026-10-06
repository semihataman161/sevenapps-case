import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import type { StepDotProps } from './types';

export type * from './types';

export function StepDot({ active }: StepDotProps) {
  const style = useAnimatedStyle(() => ({
    flex: withTiming(active ? 2 : 1, { duration: 250 }),
    opacity: withTiming(active ? 1 : 0.35, { duration: 250 }),
  }));
  return <Animated.View style={style} className="h-1.5 rounded-full bg-accent" />;
}
