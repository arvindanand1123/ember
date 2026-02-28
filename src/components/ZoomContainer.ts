import styled from 'styled-components';

import { semanticSpacing } from './theme';
import { Container, type ContainerSpec } from './Container';

const zoomContainerSpec: ContainerSpec = {
  stackType: 'row',
  align: 'center',
  gap: semanticSpacing.compactGap,
};

export const ZoomContainer = styled(Container).attrs({
  spec: zoomContainerSpec,
})``;
