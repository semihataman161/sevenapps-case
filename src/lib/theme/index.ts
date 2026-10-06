import { useColorScheme } from 'react-native';

import type { ThemeColors, ThemePalette } from './types';

export type * from './types';

const palette: ThemePalette = {
  light: {
    accent: '#6d5dfc',
    text: '#111118',
    muted: '#6b6b7b',
    background: '#ffffff',
    card: '#f4f4f7',
    border: '#e4e4ea',
    danger: '#e5484d',
  },
  dark: {
    accent: '#8b7dff',
    text: '#f4f4f7',
    muted: '#9b9bab',
    background: '#0b0b0f',
    card: '#1a1a22',
    border: '#2a2a35',
    danger: '#ff6369',
  },
};

export function useThemeColors(): ThemeColors {
  return palette[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
