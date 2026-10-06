import { Text, View } from 'react-native';

import type { InfoRowProps } from './types';

export type * from './types';

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View className="min-h-14 flex-row items-center justify-between px-4 py-3">
      <Text className="text-base text-ink dark:text-white">{label}</Text>
      <Text className="text-base text-ink-muted">{value}</Text>
    </View>
  );
}
