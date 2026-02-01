import styled from 'styled-components';

import { Button } from './styles';

export const BackButton = styled(Button)`
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  height: ${({ theme }) => theme.controlSizes.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.dangerText};
`;
