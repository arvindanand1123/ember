import styled from 'styled-components';

import { semanticSpacing } from './theme';
import { Container, type ContainerSpec } from './Container';

const controlsLeftSpec: ContainerSpec = {
  stackType: 'row',
  align: 'center',
  gap: semanticSpacing.controlsGap,
};

export const ControlsLeft = styled(Container).attrs({
  spec: controlsLeftSpec,
})``;
