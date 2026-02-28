import { Container, type ContainerSpec } from '../Container';
import { semanticSpacing } from '../theme';

const zoomContainerSpec: ContainerSpec = {
  stackType: 'row',
  align: 'center',
  gap: semanticSpacing.compactGap,
};

export const ZoomContainer = Container.build(zoomContainerSpec);
