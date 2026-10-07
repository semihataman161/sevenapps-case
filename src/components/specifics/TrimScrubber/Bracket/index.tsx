import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { cn } from '@/lib';

import { Row, Typography } from '@/components/commons';

import { LINE } from './styles';
import type { BracketProps } from './types';

export type * from './types';

export function Bracket({ style, width, label }: BracketProps) {
  return (
    <Animated.View pointerEvents="none" style={[{ width }, style]} className="mt-2">
      <Row>
        <View className={cn('h-2 w-px', LINE)} />
        <View className={cn('h-px flex-1', LINE)} />
        <View className={cn('h-2 w-px', LINE)} />
      </Row>
      <Typography variant="overline" tone="accent" tabular className="mt-1.5 text-center">
        {label}
      </Typography>
    </Animated.View>
  );
}
