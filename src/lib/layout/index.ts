import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MIN_BOTTOM_AREA = Platform.OS === 'android' ? 48 : 32;
const BUTTON_GAP = 16;

export function useBottomGap(): number {
  const { bottom } = useSafeAreaInsets();
  if (bottom === 0) return BUTTON_GAP;
  return Math.max(bottom, MIN_BOTTOM_AREA) - bottom + BUTTON_GAP;
}
