import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mediterrane Palette — Sand, Terrakotta, Olive, Himmelblau, Anthrazit
        sand: {
          50: '#FBF8F2',
          100: '#F6F0E5',
          200: '#EDE3D2',
          300: '#E0D2B9',
          400: '#CDBA9B',
          500: '#B8A17E',
          600: '#9C8465',
        },
        offwhite: '#FAF7F2',
        terracotta: {
          300: '#E2A57C',
          400: '#D08758',
          500: '#BC6B3E',
          600: '#9E5430',
          700: '#7C4126',
        },
        olive: {
          300: '#AFB894',
          400: '#8E9A72',
          500: '#6F7C55',
          600: '#556042',
          700: '#3E4732',
        },
        sky: {
          300: '#C3D5DE',
          400: '#9EB8C6',
          500: '#7A97A8',
          600: '#5C7686',
        },
        ink: {
          400: '#5A574F',
          600: '#33322D',
          800: '#22221E',
          900: '#141412',
          950: '#0B0B09',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'ui-serif', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        overline: '0.34em',
      },
      maxWidth: {
        prose: '38rem',
      },
      transitionTimingFunction: {
        // Ruhige, "cineastische" Kurve für Hover- und Layoutübergänge
        cinema: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1.04) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.16) translate3d(0, -1.5%, 0)' },
        },
        'scroll-hint': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.35' },
          '50%': { transform: 'translateY(7px)', opacity: '1' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 24s ease-out forwards',
        'scroll-hint': 'scroll-hint 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
