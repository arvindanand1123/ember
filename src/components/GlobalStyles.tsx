import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.base};
    line-height: ${({ theme }) => theme.lineHeights.base};
    font-weight: ${({ theme }) => theme.fontWeights.regular};

    color: ${({ theme }) => theme.colors.foreground};
    background-color: ${({ theme }) => theme.colors.background};

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  /* CSS Reset */
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
  }

  /* Typography */
  h1 {
    text-align: center;
  }

  a {
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: inherit;

    &:hover {
      color: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  /* Form elements */
  input,
  button {
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    font-family: inherit;
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.surface};
    transition: border-color 0.25s;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    outline: none;
  }

  button {
    cursor: pointer;

    &:hover {
      border-color: ${({ theme }) => theme.colors.borderHover};
      background-color: ${({ theme }) => theme.colors.surfaceHover};
    }

    &:active {
      border-color: ${({ theme }) => theme.colors.borderHover};
      background-color: ${({ theme }) => theme.colors.surface};
    }
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.selection};
  }

  .pdf-page {
    position: relative;
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  .pdf-page img {
    max-width: 100%;
    height: auto;
  }
`;
