import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* Typography */
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: ${({ theme }) => theme.fontSizes.base};
    line-height: ${({ theme }) => theme.lineHeights.normal};
    font-weight: ${({ theme }) => theme.fontWeights.regular};

    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.bg};

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0ms !important;
      transition-duration: 0ms !important;
    }
  }

  /* CSS Reset */
  * {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
  }

  /* Typography */
  h1 {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    line-height: ${({ theme }) => theme.lineHeights.tight};
    text-align: center;
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    line-height: ${({ theme }) => theme.lineHeights.tight};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    line-height: ${({ theme }) => theme.lineHeights.tight};
  }

  a {
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: inherit;
    transition: color ${({ theme }) => theme.motion.duration.normal} ${({ theme }) => theme.motion.easing.standard};

    &:hover {
      color: ${({ theme }) => theme.colors.accentHover};
    }

    &:active {
      color: ${({ theme }) => theme.colors.accentActive};
    }
  }

  /* Form elements */
  input,
  button {
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 0 ${({ theme }) => theme.space[3]};
    height: ${({ theme }) => theme.controlSizes.md};
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    font-family: inherit;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.surface};
    transition:
      transform ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.standard},
      background ${({ theme }) => theme.motion.duration.normal} ${({ theme }) => theme.motion.easing.standard},
      border-color ${({ theme }) => theme.motion.duration.normal} ${({ theme }) => theme.motion.easing.standard};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    outline: none;
  }

  button {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[2]};

    &:hover {
      background-color: rgba(255, 255, 255, 0.04);
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      box-shadow:
        0 0 0 3px ${({ theme }) => theme.colors.surface},
        0 0 0 6px ${({ theme }) => theme.colors.focusRing};
    }
  }

  input {
    background: rgba(255, 255, 255, 0.03);

    &::placeholder {
      color: ${({ theme }) => theme.colors.textSubtle};
    }

    &:focus-visible {
      box-shadow:
        0 0 0 3px ${({ theme }) => theme.colors.surface},
        0 0 0 6px ${({ theme }) => theme.colors.focusRing};
    }
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.selection};
  }

  /* PDF page styles */
  .pdf-page {
    position: relative;
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  .pdf-page img {
    max-width: 100%;
    height: auto;
  }

  /* Utility classes for focus ring */
  .focusable:focus {
    outline: none;
  }

  .focusable:focus-visible {
    box-shadow:
      0 0 0 3px ${({ theme }) => theme.colors.surface},
      0 0 0 6px ${({ theme }) => theme.colors.focusRing};
  }
`;
