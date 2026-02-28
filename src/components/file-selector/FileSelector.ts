import styled from 'styled-components';

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
