
import { Container, type ContainerSpec } from '../Container';
import { semanticSpacing } from '../theme';

const controlsRightSpec: ContainerSpec = {
  stackType: 'row',
  align: 'center',
  justify: 'flex-end',
  gap: semanticSpacing.controlsGap,
};

export const ControlsRight = Container.build(controlsRightSpec);
