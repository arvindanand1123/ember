import { Container, type ContainerSpec } from '../Container';
import { semanticSpacing } from '../theme';

export const ControlsLeft = Container.build({
  stackType: 'row',
  align: 'center',
  gap: semanticSpacing.controlsGap,
} satisfies ContainerSpec);
