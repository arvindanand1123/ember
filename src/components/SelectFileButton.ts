import styled from 'styled-components';

import { ButtonPrimary } from './styles';

export const SelectFileButton = styled(ButtonPrimary)`
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[6]};
  height: ${({ theme }) => theme.controlSizes.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;
