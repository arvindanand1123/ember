import { Container, type ContainerSpec } from './Container';
import { semanticSpacing } from './theme';

const controlsLeftSpec: ContainerSpec = {
  stackType: 'row',
  align: 'center',
  gap: semanticSpacing.controlsGap,
};

export const ControlsLeft = Container.build(controlsLeftSpec);
