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
  border: 2px dashed ${({ $isDragging, theme }) => $isDragging ? theme.colors.primary : 'transparent'};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ $isDragging }) => $isDragging ? 'rgba(74, 158, 255, 0.1)' : 'transparent'};
  transition: all 0.2s ease;
`;

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

export const HintText = styled.p`
  margin-top: ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const ErrorText = styled.p`
  margin-top: ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.colors.danger};
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
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PDFDocumentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space[5]};
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
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export const CommandInputContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.space[5]};
  right: ${({ theme }) => theme.space[5]};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space[2]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 300px;
  z-index: 1000;
`;

export const CommandPrompt = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const CommandInputField = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;
