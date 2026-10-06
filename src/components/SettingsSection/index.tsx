import { Children, Fragment } from 'react';
import { Text, View } from 'react-native';

import { useUpperCase } from '@/i18n';

import type { SettingsSectionProps } from './types';

export type * from './types';

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const upper = useUpperCase();
  const rows = Children.toArray(children);
  return (
    <View>
      <Text className="mb-2 ml-4 text-xs font-semibold tracking-wider text-ink-muted">
        {upper(title)}
      </Text>
      <View className="overflow-hidden rounded-3xl bg-surface-muted dark:bg-surface-dark-muted">
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 ? <View className="ml-4 h-px bg-black/5 dark:bg-white/10" /> : null}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}
