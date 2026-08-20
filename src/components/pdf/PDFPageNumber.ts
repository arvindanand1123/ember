import { Container, type ContainerSpec } from '../Container';

export const PDFPageNumber = Container.build({
  position: 'absolute',
  bottom: 2,
  right: 2,
  paddingX: 2,
  paddingY: 1,
  radius: 'sm',
  fontSize: 'xs',
  background: 'backdrop',
  textColor: 'text',
} satisfies ContainerSpec);
