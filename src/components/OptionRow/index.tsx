import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '@/lib';

import type { OptionRowProps } from './types';

export type * from './types';

export function OptionRow({ label, hint, icon, selected, onPress }: OptionRowProps) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityHint={hint}
      className="min-h-14 flex-row items-center gap-3 px-4 py-3 active:bg-black/5 dark:active:bg-white/5"
    >
      {icon ? <Ionicons name={icon} size={20} color={colors.accent} /> : null}
      <View className="flex-1">
        <Text className="text-base text-ink dark:text-white">{label}</Text>
        {hint ? <Text className="mt-0.5 text-xs text-ink-muted">{hint}</Text> : null}
      </View>
      {selected ? <Ionicons name="checkmark" size={20} color={colors.accent} /> : null}
    </Pressable>
  );
}
