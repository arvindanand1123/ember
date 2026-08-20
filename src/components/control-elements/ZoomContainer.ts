import { Container, type ContainerSpec } from '../Container';
import { semanticSpacing } from '../theme';

export const ZoomContainer = Container.build({
  stackType: 'row',
  align: 'center',
  gap: semanticSpacing.compactGap,
} satisfies ContainerSpec);
