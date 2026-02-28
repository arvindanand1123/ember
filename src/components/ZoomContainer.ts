import styled from 'styled-components';

import { Container, type ContainerSpec } from './Container';
import { semanticSpacing } from './theme';

const zoomContainerSpec: ContainerSpec = {
  stackType: 'row',
  align: 'center',
  gap: semanticSpacing.compactGap,
};

export const ZoomContainer = styled(Container).attrs({
  spec: zoomContainerSpec,
})``;
