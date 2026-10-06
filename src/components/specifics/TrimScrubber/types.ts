import type { VideoPlayer } from 'expo-video';
import type { ViewStyle } from 'react-native';
import type { useAnimatedStyle } from 'react-native-reanimated';

import type { FilmstripFrames } from '@/hooks';

export type TrimScrubberProps = {
  player: VideoPlayer;
  duration: number;
  start: number;
  frames: FilmstripFrames;
  onScrub: (start: number) => void;
  onChange: (start: number) => void;
};

export type AnimatedViewStyle = ReturnType<typeof useAnimatedStyle<ViewStyle>>;
