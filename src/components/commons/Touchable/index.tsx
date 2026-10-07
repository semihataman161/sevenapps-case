import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { TouchableProps } from './types';

export type * from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Touchable({
  pressedOpacity = 0.6,
  pressedScale = 1,
  style,
  onPressIn,
  onPressOut,
  ...props
}: TouchableProps) {
  const pressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    const progress = pressed.get();
    return {
      opacity: 1 + (pressedOpacity - 1) * progress,
      transform: [{ scale: 1 + (pressedScale - 1) * progress }],
    };
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
