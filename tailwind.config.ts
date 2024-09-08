import type { Config } from 'tailwindcss'
import { fontFamily, spacing } from 'tailwindcss/defaultTheme';
import twColors from 'tailwindcss/colors';

const sansFontFamily = ['var(--font-inter)', 'Inter', ...fontFamily.sans];
const breakpoints = {
  'mobile-md': '375px',
  'mobile-lg': '425px',
  'tablet-sm': '596px',
  'tablet-md': '768px',
  desktop: '960px',
  'desktop-lg': '1359px'
};
const config: Config = {
  darkMode: ["class"],
  content: [
    './dist/index.html',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: breakpoints,
    colors: {
      black: twColors.black,
      white: twColors.white,
      blue: twColors.blue,
      board: "#F4F7FA",
      dark: "#B7C0D8",
      light: "#E8EDF9",
    },
    extend: {
      fontFamily: {
        sans: [
          sansFontFamily,
          {
            fontFeatureSettings:
              // eslint-disable-next-line max-len
              "'calt' 1, 'dlig' 1, 'case' 1, 'ccmp' 1, 'zero' 1, 'ss01' 1, 'ss02' 1, 'cv01' 1, 'cv03' 1, 'cv04' 1, 'cv06' 1, 'cv09' 1",
          },
        ],
        queen: [
          ['var(--font-queen)', 'Queen'],
          { fontFeatureSettings: "'calt' 1, 'zero' 1, 'dlig' 1" },
        ],
        manhandle: [
          ['var(--font-manhandle)', 'ManHandle'],
          { fontFeatureSettings: "'calt' 1, 'zero' 1, 'dlig' 1" },
        ],
        pistilli: [
          ['var(--font-pistilli)', 'Pistilli'],
          { fontFeatureSettings: "'calt' 1, 'zero' 1, 'dlig' 1" },
        ],
        mono: ['monospace', ...fontFamily.mono],
      },

    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      light: {
        "primary": "#3b82f6",
        "primary-content": "#ffffff",
        "secondary": "#010101",
        "accent": "#202020",
        "base-100": "#00000000",
        "base-200": "#202020",
        "base-300": "#898989",
        "base-content": "#fff",
        "neutral": "#0000",
        "neutral-content": "#fff",
        "success": "rgba(16, 185, 129)",
        "success-content": "#ffffff",
        "error": "rgba(244, 63, 94)",
        "error-content": "#ffffff",
        "warning": "rgba(234, 179, 8)",
        "warning-content": "#ffffff",
      },

      dark: {
        "primary": "#3b82f6",
        "primary-content": "#ffffff",
        "secondary": "#010101",
        "accent": "#202020",
        "base-100": "#00000000",
        "base-200": "#202020",
        "base-300": "#898989",
        "base-content": "#fff",
        "neutral": "#0000",
        "neutral-content": "#fff",
        "success": "rgba(16, 185, 129)",
        "success-content": "#ffffff",
        "error": "rgba(244, 63, 94)",
        "error-content": "#ffffff",
        "warning": "rgba(234, 179, 8)",
        "warning-content": "#ffffff",
      },
    }]
  },
}
export default config
