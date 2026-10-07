import { View } from 'react-native';

import { Row, Touchable, Typography } from '@/components/commons';

import type { OptionRowProps } from './types';

export type * from './types';

export function OptionRow({ label, hint, selected, className = '', ...props }: OptionRowProps) {
  return (
    <Touchable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityHint={hint}
      className={`-mx-5 px-5 ${selected ? 'bg-ink dark:bg-ink-dark' : ''} ${className}`}
      {...props}
    >
      <Row className="min-h-14 py-4">
        <View className="flex-1">
          <Typography
            weight={selected ? 'medium' : 'regular'}
            tone={selected ? 'inverse' : 'default'}
          >
            {label}
          </Typography>
          {hint ? (
            <Typography
              variant="caption"
              tone={selected ? 'inverse' : 'secondary'}
              className={`mt-1 ${selected ? 'opacity-70' : ''}`}
            >
              {hint}
            </Typography>
          ) : null}
        </View>
      </Row>
    </Touchable>
  );
}
