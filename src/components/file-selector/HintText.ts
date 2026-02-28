import styled from 'styled-components';

export const HintText = styled.p`
  margin-top: ${({ theme }) => theme.space[6]};
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
