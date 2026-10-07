import type { ViewStyle } from 'react-native';
import type { useAnimatedStyle } from 'react-native-reanimated';

import type { FilmstripFrames } from '@/hooks';
import type { MediaPlayer } from '@/services';

export type TrimScrubberLabels = {
  selector: string;
  start: string;
  end: string;
  hint?: string;
};

export type TrimScrubberProps = {
  media: MediaPlayer;
  duration: number;
  windowLength: number;
  start: number;
  disabled?: boolean;
  frames: FilmstripFrames;
  labels: TrimScrubberLabels;
  formatLength: (seconds: number) => string;
  formatRange: (start: number, end: number) => string;
  onScrub: (start: number) => void;
  onChange: (start: number) => void;
};

export type AnimatedViewStyle = ReturnType<typeof useAnimatedStyle<ViewStyle>>;
