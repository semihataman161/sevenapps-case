import { View } from 'react-native';

import { Thumbnail } from '@/components/commons';
import { SCRUBBER_TRACK_HEIGHT } from '@/lib';

import { SprocketBand } from './SprocketBand';
import { FILM_BASE, SPROCKET_BAND } from './styles';
import type { FilmstripProps } from './types';

export type * from './types';

export function Filmstrip({ frames }: FilmstripProps) {
  const frameHeight = SCRUBBER_TRACK_HEIGHT - SPROCKET_BAND * 2;

  return (
    <View className="absolute inset-0" style={{ backgroundColor: FILM_BASE }}>
      <SprocketBand />
      <View className="flex-row" style={{ height: frameHeight, gap: 1 }}>
        {frames.map((frame, index) => (
          <Thumbnail
            key={index}
            source={frame}
            transition={120}
            style={{ flex: 1, width: undefined, height: frameHeight }}
          />
        ))}
      </View>
      <SprocketBand />
    </View>
  );
}
