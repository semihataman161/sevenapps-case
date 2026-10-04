import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useThemeColors } from '@/lib/theme';

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const colors = useThemeColors();
  return (
    <Animated.View entering={FadeInDown.duration(400)} className="items-center px-10 py-16">
      <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-accent-soft dark:bg-surface-dark-muted">
        <Ionicons name={icon} size={36} color={colors.accent} />
      </View>
      <Text className="mb-2 text-center text-xl font-bold text-ink dark:text-white">{title}</Text>
      <Text className="mb-8 text-center text-base leading-6 text-ink-muted">{message}</Text>
      {action}
    </Animated.View>
  );
}
