import styled from 'styled-components';

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
