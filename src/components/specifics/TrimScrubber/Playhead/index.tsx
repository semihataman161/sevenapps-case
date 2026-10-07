import Animated from 'react-native-reanimated';

import { SCRUBBER_TRACK_HEIGHT } from '@/lib';

import type { PlayheadProps } from './types';

export type * from './types';

export function Playhead({ style }: PlayheadProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ height: SCRUBBER_TRACK_HEIGHT }, style]}
      className="absolute left-0 top-0 w-px bg-white"
    />
  );
}
