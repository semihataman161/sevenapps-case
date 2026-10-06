import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/lib';

import type { MetaItemProps } from './types';

export type * from './types';

export function MetaItem({ icon, text }: MetaItemProps) {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name={icon} size={14} color={colors.muted} />
      <Text className="text-sm text-ink-muted">{text}</Text>
    </View>
  );
}
