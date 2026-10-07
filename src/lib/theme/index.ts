import { useColorScheme } from 'react-native';

import type { FontFamilies, ThemeColors, ThemePalette } from './types';

export type * from './types';

const palette: ThemePalette = {
  light: {
    background: '#F5F3EE',
    surface: '#ECE9E2',
    text: '#171717',
    secondary: '#77736C',
    muted: '#9A968F',
    border: '#D8D4CC',
    accent: '#A33A32',
    inverse: '#F5F3EE',
  },
  dark: {
    background: '#121110',
    surface: '#1D1B18',
    text: '#EDEAE3',
    secondary: '#A29D94',
    muted: '#77726A',
    border: '#2F2C28',
    accent: '#D0685E',
    inverse: '#121110',
  },
};

export const FONTS: FontFamilies = {
  serif: 'DMSerifDisplay_400Regular',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
};

export function useThemeColors(): ThemeColors {
  return palette[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
