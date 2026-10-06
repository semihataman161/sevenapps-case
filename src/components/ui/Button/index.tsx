import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { ButtonProps, ButtonVariant } from './types';

export type * from './types';

const containerClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent dark:bg-accent',
  secondary: 'bg-surface-muted dark:bg-surface-dark-muted',
  danger: 'bg-red-50 dark:bg-red-950',
};

const textClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-ink dark:text-white',
  danger: 'text-red-600 dark:text-red-400',
};

const iconColors: Record<ButtonVariant, string> = {
  primary: '#ffffff',
  secondary: '#6d5dfc',
  danger: '#e5484d',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  variant = 'primary',
  icon,
  loading = false,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPressIn={() => scale.set(withSpring(0.97, { duration: 150 }))}
      onPressOut={() => scale.set(withSpring(1, { duration: 200 }))}
      style={animatedStyle}
      className={`h-14 flex-row items-center justify-center rounded-2xl px-5 ${containerClasses[variant]} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={iconColors[variant]} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon ? <Ionicons name={icon} size={20} color={iconColors[variant]} /> : null}
          <Text className={`text-base font-semibold ${textClasses[variant]}`}>{title}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}
