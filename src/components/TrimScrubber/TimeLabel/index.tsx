import { Text, View } from 'react-native';

import type { TimeLabelProps } from './types';

export type * from './types';

export function TimeLabel({ label, value, alignRight = false }: TimeLabelProps) {
  return (
    <View className={alignRight ? 'items-end' : 'items-start'}>
      <Text className="text-[11px] font-semibold tracking-wider text-ink-muted">{label}</Text>
      <Text
        className="text-base font-semibold text-ink dark:text-white"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
    </View>
  );
}
