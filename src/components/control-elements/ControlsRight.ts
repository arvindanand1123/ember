
import { Container, type ContainerSpec } from '../Container';
import { semanticSpacing } from '../theme';

export const ControlsRight = Container.build({
  stackType: 'row',
  align: 'center',
  justify: 'flex-end',
  gap: semanticSpacing.controlsGap,
} satisfies ContainerSpec);
