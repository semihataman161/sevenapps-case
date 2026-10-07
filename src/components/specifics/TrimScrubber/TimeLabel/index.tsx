import { View } from 'react-native';

import { Typography } from '@/components/commons';

import type { TimeLabelProps } from './types';

export type * from './types';

export function TimeLabel({ label, value, alignRight = false }: TimeLabelProps) {
  return (
    <View className={alignRight ? 'items-end' : 'items-start'}>
      <Typography variant="overline" tone="muted">
        {label}
      </Typography>
      <Typography variant="label" weight="medium" tabular className="mt-1">
        {value}
      </Typography>
    </View>
  );
}
