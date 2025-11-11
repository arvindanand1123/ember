import styled from 'styled-components';

export const Button = styled.button`
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
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:active {
    border-color: ${({ theme }) => theme.colors.borderHover};
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

export const SelectFileButton = styled(Button)`
  padding: 12px 24px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const BackButton = styled(Button)`
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.danger};
`;

export const ClearButton = styled(Button)`
  padding: 6px 12px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  background-color: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.dangerText};
  border: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerHover};
    border-color: ${({ theme }) => theme.colors.dangerHover};
  }
`;
