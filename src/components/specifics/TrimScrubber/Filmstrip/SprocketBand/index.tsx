import { View } from 'react-native';

import { SPROCKET_BAND, SPROCKET_HOLES } from '../styles';

export function SprocketBand() {
  return (
    <View className="flex-row items-center justify-between px-1" style={{ height: SPROCKET_BAND }}>
      {SPROCKET_HOLES.map((hole) => (
        <View key={hole} className="h-[3px] w-[5px] rounded-[1px] bg-white/25" />
      ))}
    </View>
  );
}
