import styled from 'styled-components';

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
