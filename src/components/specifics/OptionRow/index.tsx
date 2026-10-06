import { Pressable, View } from 'react-native';

import { Icon, Row, Typography } from '@/components/commons';

import type { OptionRowProps } from './types';

export type * from './types';

export function OptionRow({
  label,
  hint,
  icon,
  selected,
  className = '',
  ...props
}: OptionRowProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityHint={hint}
      className={`active:bg-black/5 dark:active:bg-white/5 ${className}`}
      {...props}
    >
      <Row gap={12} className="min-h-14 px-4 py-3">
        {icon ? <Icon name={icon} tone="accent" /> : null}
        <View className="flex-1">
          <Typography>{label}</Typography>
          {hint ? (
            <Typography variant="caption" tone="muted" className="mt-0.5">
              {hint}
            </Typography>
          ) : null}
        </View>
        {selected ? <Icon name="checkmark" tone="accent" /> : null}
      </Row>
    </Pressable>
  );
}
