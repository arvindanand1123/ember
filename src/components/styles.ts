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

export const PDFViewer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const FileSelector = styled.div<{ $isDragging?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.space[6]};
  border: 2px dashed ${({ $isDragging, theme }) => ($isDragging ? theme.colors.accent : 'transparent')};
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ $isDragging }) => ($isDragging ? 'rgba(255, 159, 28, 0.1)' : 'transparent')};
  transition: all ${({ theme }) => theme.motion.duration.normal} ${({ theme }) => theme.motion.easing.standard};
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

export const SelectFileButton = styled(ButtonPrimary)`
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[6]};
  height: ${({ theme }) => theme.controlSizes.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const BackButton = styled(Button)`
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  height: ${({ theme }) => theme.controlSizes.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.dangerText};
`;

export const HintText = styled.p`
  margin-top: ${({ theme }) => theme.space[6]};
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const ErrorText = styled.p`
  margin-top: ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.colors.dangerText};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export const PDFControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const ControlsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

export const PageInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const PDFDocumentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space[6]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

export const PDFPage = styled.div<{ $width: number; $height: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export const PDFPageNumber = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.space[2]};
  right: ${({ theme }) => theme.space[2]};
  background: ${({ theme }) => theme.colors.backdrop};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export const CommandInputContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.space[6]};
  right: ${({ theme }) => theme.space[6]};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[2]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 300px;
  z-index: ${({ theme }) => theme.zIndex.popover};
`;

export const CommandPrompt = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const CommandInputField = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  height: auto;
  padding: 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:focus-visible {
    box-shadow: none;
  }
`;

// Card components from the new design system
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

// Badge component
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

// Keyboard shortcut styling
export const Kbd = styled.kbd`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom-color: ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

// Semantic callout components
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

// Text utilities
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
