import type { VideoPlayer } from 'expo-video';
import type { ViewStyle } from 'react-native';
import type { useAnimatedStyle } from 'react-native-reanimated';

import type { FilmstripFrames } from '@/hooks';

export type TrimScrubberLabels = {
  selector: string;
  start: string;
  end: string;
  hint?: string;
};

export type TrimScrubberProps = {
  player: VideoPlayer;
  duration: number;
  windowLength: number;
  start: number;
  frames: FilmstripFrames;
  labels: TrimScrubberLabels;
  formatLength: (seconds: number) => string;
  formatRange: (start: number, end: number) => string;
  onScrub: (start: number) => void;
  onChange: (start: number) => void;
};

export type AnimatedViewStyle = ReturnType<typeof useAnimatedStyle<ViewStyle>>;
