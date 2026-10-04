import { useVideoPlayer, VideoView, type VideoPlayer as ExpoVideoPlayer } from 'expo-video';
import { useWindowDimensions, View } from 'react-native';

import { configurePlayer } from '@/lib/player';

type VideoFrameProps = {
  player: ExpoVideoPlayer;
  aspectRatio?: number;
  nativeControls?: boolean;
  className?: string;
};

export function VideoFrame({
  player,
  aspectRatio,
  nativeControls = true,
  className = '',
}: VideoFrameProps) {
  const window = useWindowDimensions();
  const minRatio = (window.width - 40) / (window.height * 0.42);
  const ratio = Math.max(aspectRatio && aspectRatio > 0 ? aspectRatio : 16 / 9, minRatio);
  return (
    <View
      className={`w-full overflow-hidden rounded-3xl bg-black ${className}`}
      style={{ aspectRatio: ratio }}
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

type VideoPlayerProps = Omit<VideoFrameProps, 'player'> & {
  uri: string;
  autoPlay?: boolean;
  loop?: boolean;
};

export function VideoPlayer({
  uri,
  autoPlay = false,
  loop = false,
  ...frameProps
}: VideoPlayerProps) {
  const player = useVideoPlayer(uri, (p) => {
    configurePlayer(p, { loop });
    if (autoPlay) p.play();
  });
  return <VideoFrame player={player} {...frameProps} />;
}
