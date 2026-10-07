import { useColorScheme } from 'react-native';

import { palette } from './palette';
import type { FontFamilies, ThemeColors } from './types';

export { palette } from './palette';
export type * from './types';

export const FONTS: FontFamilies = {
  serif: 'DMSerifDisplay_400Regular',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
};

export function useThemeColors(): ThemeColors {
  return palette[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
