import styled from 'styled-components';

export const Container = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
`;

export const Button = styled.button`
  height: ${({ theme }) => theme.controlSizes.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
  background-color: transparent;
  transition:
    transform ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.standard},
    background ${({ theme }) => theme.motion.duration.normal} ${({ theme }) => theme.motion.easing.standard},
    border-color ${({ theme }) => theme.motion.duration.normal} ${({ theme }) => theme.motion.easing.standard};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  outline: none;
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
`;

export const ButtonPrimary = styled(Button)`
  background-color: ${({ theme }) => theme.colors.accent};
  border-color: transparent;
  color: ${({ theme }) => theme.colors.accentText};

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.accentActive};
  }
`;

export const ButtonDestructive = styled(Button)`
  background-color: ${({ theme }) => theme.colors.dangerText};
  color: ${({ theme }) => theme.colors.textInverse};
  border-color: transparent;

  &:hover {
    filter: brightness(1.05);
    background-color: ${({ theme }) => theme.colors.dangerText};
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.space[6]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const CardElevated = styled.div`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.space[6]};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export const Kbd = styled.kbd`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom-color: ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Callout = styled.div<{ $variant?: 'success' | 'warning' | 'danger' | 'info' }>`
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme, $variant = 'info' }) => theme.colors[`${$variant}Border`]};
  background: ${({ theme, $variant = 'info' }) => theme.colors[`${$variant}Bg`]};
  padding: ${({ theme }) => theme.space[3]};
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  align-items: flex-start;
`;

export const CalloutTitle = styled.p<{ $variant?: 'success' | 'warning' | 'danger' | 'info' }>`
  margin: 0;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $variant = 'info' }) => theme.colors[`${$variant}Text`]};
`;

export const CalloutBody = styled.p`
  margin: 2px 0 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export const TextMuted = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const TextSubtle = styled.span`
  color: ${({ theme }) => theme.colors.textSubtle};
`;

export const TextSmall = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const IconButton = styled(Button)<{ $size?: 'sm' | 'md' | 'lg' }>`
  width: ${({ theme, $size = 'sm' }) => theme.controlSizes[$size]};
  height: ${({ theme, $size = 'sm' }) => theme.controlSizes[$size]};
  padding: 0;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};

  & > svg {
    width: ${({ theme, $size = 'sm' }) => theme.iconSizes[$size]};
    height: ${({ theme, $size = 'sm' }) => theme.iconSizes[$size]};
    color: inherit;
    flex-shrink: 0;
  }
`;
