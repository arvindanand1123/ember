/**
 * Ember Design System - Token Definitions
 * A warm, ember-inspired design system with dark and light mode support.
 */

export const colors = {
  dark: {
    // Ember — darkness base
    bg: '#0b0806',
    surface: '#120d0a',
    surfaceElevated: '#1a130f',

    // Text
    text: '#f5efe9',
    textMuted: '#cbbfb3',
    textSubtle: '#9f8f80',
    textInverse: '#120d0a',

    // Borders
    border: 'rgba(245,239,233,.10)',
    borderStrong: 'rgba(245,239,233,.20)',

    // Brand / accent (flame core)
    accent: '#ff9f1c',
    accentHover: '#ffb347',
    accentActive: '#ff8c00',
    accentText: '#1a0f05',

    // Semantic
    successBg: 'rgba(52, 211, 153, .12)',
    successText: '#6ee7b7',
    successBorder: 'rgba(110, 231, 183, .28)',

    warningBg: 'rgba(255, 159, 28, .14)',
    warningText: '#ffd166',
    warningBorder: 'rgba(255, 209, 102, .32)',

    dangerBg: 'rgba(220, 38, 38, .14)',
    dangerText: '#fca5a5',
    dangerBorder: 'rgba(252, 165, 165, .30)',

    infoBg: 'rgba(96, 165, 250, .12)',
    infoText: '#bfdbfe',
    infoBorder: 'rgba(191, 219, 254, .28)',

    // Focus
    focusRing: 'rgba(255, 159, 28, .85)',

    // Overlay
    backdrop: 'rgba(5,3,2,.65)',

    // Selection
    selection: 'rgba(255, 159, 28, .35)',
  },
  light: {
    // Ember — light mode (firelight, not daylight)
    bg: '#faf6f1',
    surface: '#fffaf4',
    surfaceElevated: '#fff3e6',

    // Text
    text: '#2b1b12',
    textMuted: '#5a3d2b',
    textSubtle: '#8a6a55',
    textInverse: '#fffaf4',

    // Borders
    border: 'rgba(43,27,18,.10)',
    borderStrong: 'rgba(43,27,18,.18)',

    // Brand / accent (flame core)
    accent: '#ff9f1c',
    accentHover: '#ffb347',
    accentActive: '#ff8c00',
    accentText: '#2b1b12',

    // Semantic
    successBg: 'rgba(16, 185, 129, .12)',
    successText: '#065f46',
    successBorder: 'rgba(5, 150, 105, .28)',

    warningBg: 'rgba(255, 159, 28, .18)',
    warningText: '#92400e',
    warningBorder: 'rgba(255, 159, 28, .35)',

    dangerBg: 'rgba(220, 38, 38, .12)',
    dangerText: '#7f1d1d',
    dangerBorder: 'rgba(220, 38, 38, .28)',

    infoBg: 'rgba(96, 165, 250, .12)',
    infoText: '#1e3a8a',
    infoBorder: 'rgba(59, 130, 246, .28)',

    // Focus
    focusRing: 'rgba(255, 159, 28, .65)',

    // Overlay
    backdrop: 'rgba(20,12,8,.35)',

    // Selection
    selection: 'rgba(255, 159, 28, .25)',
  },
} as const;

export const fonts = {
  sans: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const;

export const fontSizes = {
  xs: '12px',
  sm: '13px',
  base: '14px',
  lg: '16px',
  xl: '18px',
  '2xl': '22px',
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
} as const;

export const lineHeights = {
  tight: 1.15,
  normal: 1.35,
  relaxed: 1.6,
} as const;

export const space = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export const controlSizes = {
  sm: '28px',
  md: '34px',
  lg: '40px',
} as const;

export const iconSizes = {
  sm: '14px',
  md: '16px',
  lg: '18px',
} as const;

export const radii = {
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  pill: '999px',
} as const;

export const shadows = {
  dark: {
    sm: '0 1px 0 rgba(0,0,0,.45), 0 10px 18px rgba(255,159,28,.08)',
    md: '0 1px 0 rgba(0,0,0,.45), 0 18px 36px rgba(255,159,28,.10)',
    lg: '0 1px 0 rgba(0,0,0,.45), 0 32px 64px rgba(255,159,28,.14)',
  },
  light: {
    sm: '0 1px 0 rgba(0,0,0,.05), 0 8px 18px rgba(255,159,28,.12)',
    md: '0 1px 0 rgba(0,0,0,.06), 0 16px 30px rgba(255,159,28,.16)',
    lg: '0 1px 0 rgba(0,0,0,.08), 0 28px 60px rgba(255,159,28,.20)',
  },
} as const;

export const motion = {
  duration: {
    fast: '120ms',
    normal: '180ms',
    slow: '260ms',
  },
  easing: {
    standard: 'cubic-bezier(.2,.8,.2,1)',
    enter: 'cubic-bezier(.16,1,.3,1)',
    exit: 'cubic-bezier(.2,.8,.2,1)',
  },
} as const;

export const zIndex = {
  base: 0,
  sticky: 10,
  dropdown: 20,
  popover: 30,
  tooltip: 40,
  dialog: 50,
  toast: 60,
} as const;

export type ThemeMode = 'dark' | 'light';

export const createTheme = (mode: ThemeMode) => ({
  mode,
  colors: colors[mode],
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  space,
  controlSizes,
  iconSizes,
  radii,
  shadows: shadows[mode],
  motion,
  zIndex,
});

export const theme = createTheme('light');

export type Theme = ReturnType<typeof createTheme>;
