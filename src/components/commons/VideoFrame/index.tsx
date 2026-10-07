import { VideoView } from 'expo-video';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { DEFAULT_ASPECT_RATIO, DEFAULT_MAX_HEIGHT_RATIO } from './constants';
import type { VideoFrameProps } from './types';

export type * from './types';

export function VideoFrame({
  player,
  aspectRatio,
  maxHeightRatio = DEFAULT_MAX_HEIGHT_RATIO,
  nativeControls = true,
  className = '',
  style,
  onLayout,
  ...props
}: VideoFrameProps) {
  const window = useWindowDimensions();
  const [width, setWidth] = useState(0);
  const naturalRatio = aspectRatio && aspectRatio > 0 ? aspectRatio : DEFAULT_ASPECT_RATIO;
  const maxHeight = window.height * maxHeightRatio;
  const ratio =
    width > 0 && maxHeight > 0 ? Math.max(naturalRatio, width / maxHeight) : naturalRatio;

  return (
    <View
      className={`w-full overflow-hidden rounded-md bg-black ${className}`}
      style={[{ aspectRatio: ratio }, style]}
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
        onLayout?.(event);
      }}
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
