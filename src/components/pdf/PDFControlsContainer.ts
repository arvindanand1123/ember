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

export const PDFControlsContainer = Container.build(pdfControlsContainerSpec);
