import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { PressableScaleProps } from './types';

export type * from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({
  pressedScale = 0.98,
  pressedOpacity = 1,
  style,
  onPressIn,
  onPressOut,
  ...props
}: PressableScaleProps) {
  const pressed = useSharedValue(0);
  const animatesOpacity = pressedOpacity < 1;
  const animatedStyle = useAnimatedStyle(() => {
    const progress = pressed.get();
    const transform = [{ scale: 1 + (pressedScale - 1) * progress }];
    return animatesOpacity
      ? { transform, opacity: 1 + (pressedOpacity - 1) * progress }
      : { transform };
  });

  return (
    <AnimatedPressable
      onPressIn={(event) => {
        pressed.set(withSpring(1, { duration: 150 }));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.set(withSpring(0, { duration: 200 }));
        onPressOut?.(event);
      }}
      style={[animatedStyle, style]}
      {...props}
    />
  );
}
