module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#6d5dfc',
          soft: '#ece9ff',
          dark: '#5546d8',
        },
        ink: {
          DEFAULT: '#111118',
          muted: '#6b6b7b',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f4f4f7',
          dark: '#0b0b0f',
          'dark-muted': '#1a1a22',
        },
      },
    },
  },
  plugins: [],
};
