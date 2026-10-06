import Animated from 'react-native-reanimated';

import { SCRUBBER_TRACK_HEIGHT } from '@/lib';

import type { ShadeProps } from './types';

export type * from './types';

export function Shade({ style, className }: ShadeProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ height: SCRUBBER_TRACK_HEIGHT }, style]}
      className={`absolute top-0 bg-black/55 ${className}`}
    />
  );
}
