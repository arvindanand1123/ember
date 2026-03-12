import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';
import { semanticSpacing } from '../theme';

const pdfControlsContainerSpec: ContainerSpec = {
  stackType: 'row',
  justify: 'space-between',
  align: 'center',
  gap: semanticSpacing.controlsGap,
  paddingX: semanticSpacing.controlsBarPaddingX,
  paddingY: semanticSpacing.controlsBarPaddingY,
  surface: 'surface',
  border: 'bottom',
  shadow: 'md',
};

const PDFControlsContainerBase = Container.build(pdfControlsContainerSpec);

export const PDFControlsContainer = styled(PDFControlsContainerBase)`
  flex-wrap: wrap;
  row-gap: ${({ theme }) => theme.space[2]};
`;
