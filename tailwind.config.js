module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#F5F3EE', dark: '#121110' },
        surface: { DEFAULT: '#ECE9E2', dark: '#1D1B18' },
        ink: { DEFAULT: '#171717', dark: '#EDEAE3' },
        secondary: { DEFAULT: '#77736C', dark: '#A29D94' },
        muted: { DEFAULT: '#9A968F', dark: '#77726A' },
        rule: { DEFAULT: '#D8D4CC', dark: '#2F2C28' },
        accent: { DEFAULT: '#A33A32', dark: '#D0685E' },
      },
    },
  },
  plugins: [],
};
