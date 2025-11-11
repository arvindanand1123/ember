import * as colors from '@radix-ui/colors';

export const theme = {
  colors: {
    background: colors.grayDark.gray3,
    foreground: colors.grayDark.gray12,
    border: colors.grayDark.gray7,
    borderHover: colors.blueDark.blue8,
    surface: colors.grayDark.gray4,
    surfaceHover: colors.grayDark.gray5,
    primary: colors.blueDark.blue9,
    primaryHover: colors.blueDark.blue10,
    danger: colors.redDark.red9,
    dangerHover: colors.redDark.red10,
    dangerText: colors.grayDark.gray1,
    textPrimary: colors.grayDark.gray12,
    textSecondary: colors.grayDark.gray11,
    textTertiary: colors.grayDark.gray10,
    selection: colors.blue.blue7,
  },
  fonts: {
    body: 'Inter, Avenir, Helvetica, Arial, sans-serif',
  },
  fontSizes: {
    xs: '13px',
    sm: '14px',
    base: '16px',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
  },
  lineHeights: {
    base: '24px',
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
  },
  radii: {
    sm: '4px',
    md: '8px',
  },
  shadows: {
    sm: '0 2px 2px rgba(0, 0, 0, 0.2)',
    md: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lg: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
} as const;

export type Theme = typeof theme;
