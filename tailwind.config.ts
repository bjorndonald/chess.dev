import type { Config } from 'tailwindcss'
import { fontFamily, spacing } from 'tailwindcss/defaultTheme';

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
    extend: {
      colors: {
        board: "#F4F7FA",
        chessdark: "#B7C0D8",
        chesslight: "#E8EDF9",
        dark: "#1e1e1e",
        primary: "#010101",
        secondary: "#131313",
        tertiary: "#222222",
        accent: "#f3f3f3",
        current: "#ffff"
      },
      boxShadow: {
        commandButton: "0 0 0 3px hsl(0 0% 30%)"
      },
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
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.300"),
            "h1, h2, h3, h4, h5, h6": {
              color: theme("colors.gray.100"),
              strong: theme("colors.gray.100"),
              fontWeight: theme("fontWeight.bold"),
            },
            h1: {
              fontSize: theme("fontSize.3xl"),
              marginTop: theme("spacing.8"),
              marginBottom: theme("spacing.8")
            },
            h2: {
              fontSize: theme("fontSize.2xl"),
              marginTop: theme("spacing.8"),
              marginBottom: theme("spacing.8")
            },
            h3: {
              fontSize: theme("fontSize.xl"),
              marginTop: theme("spacing.6"),
              marginBottom: theme("spacing.6")
            },
            h4: {
              fontSize: theme("fontSize.lg"),
              marginTop: theme("spacing.6"),
              marginBottom: theme("spacing.6")
            },
            h5: {
              fontSize: theme("fontSize.lg"),
              marginTop: theme("spacing.4"),
              marginBottom: theme("spacing.4")
            },
            h6: {
              fontSize: theme("fontSize.lg"),
              marginTop: theme("spacing.4"),
              marginBottom: theme("spacing.4")
            },
            "--tw-prose-code": theme("colors.red[300]"),
            "--tw-prose-bold": theme("colors.accent"),
            "--tw-prose-quotes": theme("colors.accent")
          }
        }
      })
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [{
      light: {
        "primary": "#3b82f6",
        "primary-content": "#ffffff",
        "secondary": "#010101",
        "accent": "#010101",
        "base-100": "#000000",
        "base-200": "#010101",
        "base-300": "#202020",
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
        "accent": "#010101",
        "base-100": "#000000",
        "base-200": "#010101",
        "base-300": "#202020",
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
