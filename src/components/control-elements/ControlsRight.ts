import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';
import { semanticSpacing } from '../theme';

const controlsRightSpec: ContainerSpec = {
  stackType: 'row',
  align: 'center',
  justify: 'flex-end',
  gap: semanticSpacing.controlsGap,
};

const ControlsRightBase = Container.build(controlsRightSpec);

export const ControlsRight = styled(ControlsRightBase)`
  flex-wrap: wrap;
  row-gap: ${({ theme }) => theme.space[2]};
`;
