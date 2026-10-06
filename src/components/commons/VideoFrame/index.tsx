import { VideoView } from 'expo-video';
import { useWindowDimensions, View } from 'react-native';

import type { VideoFrameProps } from './types';

export type * from './types';

export function VideoFrame({
  player,
  aspectRatio,
  nativeControls = true,
  className = '',
  style,
  ...props
}: VideoFrameProps) {
  const window = useWindowDimensions();
  const minRatio = (window.width - 40) / (window.height * 0.42);
  const ratio = Math.max(aspectRatio && aspectRatio > 0 ? aspectRatio : 16 / 9, minRatio);

  return (
    <View
      className={`w-full overflow-hidden rounded-3xl bg-black ${className}`}
      style={[{ aspectRatio: ratio }, style]}
      {...props}
    >
      <VideoView
        player={player}
        nativeControls={nativeControls}
        contentFit="contain"
        fullscreenOptions={{ enable: nativeControls }}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}
