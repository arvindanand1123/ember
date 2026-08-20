import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';

export const FileSelector = styled(Container.build({
  width: '100%',
  stackType: 'col',
  justify: 'center',
  align: 'center',
  padding: 6,
  radius: 'lg',
} satisfies ContainerSpec))<{ $isDragging?: boolean }>`
  flex: 1;
  text-align: center;
  border: 2px dashed ${({ $isDragging, theme }) => ($isDragging ? theme.colors.accent : 'transparent')};
  background-color: ${({ $isDragging }) => ($isDragging ? 'rgba(255, 159, 28, 0.1)' : 'transparent')};
  transition: all ${({ theme }) => theme.motion.duration.normal} ${({ theme }) => theme.motion.easing.standard};
`;
