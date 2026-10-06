import { Image } from 'expo-image';
import { View } from 'react-native';

import { SCRUBBER_TRACK_HEIGHT } from '@/lib';

import type { FilmstripProps } from './types';

export type * from './types';

export function Filmstrip({ frames }: FilmstripProps) {
  return (
    <View className="absolute inset-0 flex-row">
      {frames.map((frame, index) => (
        <Image
          key={index}
          source={frame}
          contentFit="cover"
          transition={120}
          style={{ flex: 1, height: SCRUBBER_TRACK_HEIGHT }}
        />
      ))}
    </View>
  );
}
