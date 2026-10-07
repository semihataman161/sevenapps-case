import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import { palette } from './src/lib/theme/palette';
import type { ThemeColors } from './src/lib/theme/types';

const nativewindPreset: Partial<Config> = require('nativewind/preset');

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const tokens = Object.keys(palette.light) as (keyof ThemeColors)[];

function cssValue(color: string): string {
  if (!HEX_COLOR.test(color)) return color;
  return [1, 3, 5].map((index) => parseInt(color.slice(index, index + 2), 16)).join(' ');
}

function variables(colors: ThemeColors): Record<string, string> {
  return Object.fromEntries(tokens.map((token) => [`--color-${token}`, cssValue(colors[token])]));
}

const colors = Object.fromEntries(
  tokens.map((token) => [
    token,
    HEX_COLOR.test(palette.light[token])
      ? `rgb(var(--color-${token}) / <alpha-value>)`
      : `var(--color-${token})`,
  ]),
);

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [nativewindPreset],
  darkMode: 'media',
  theme: {
    extend: { colors },
  },
  plugins: [
    plugin(({ addBase }) =>
      addBase({
        ':root': variables(palette.light),
        '@media (prefers-color-scheme: dark)': { ':root': variables(palette.dark) },
      }),
    ),
  ],
} satisfies Config;
