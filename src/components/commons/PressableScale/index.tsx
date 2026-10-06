import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { PressableScaleProps } from './types';

export type * from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({
  pressedScale = 0.98,
  style,
  onPressIn,
  onPressOut,
  ...props
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      onPressIn={(event) => {
        scale.set(withSpring(pressedScale, { duration: 150 }));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, { duration: 200 }));
        onPressOut?.(event);
      }}
      style={[animatedStyle, style]}
      {...props}
    />
  );
}
