import { Container, type ContainerSpec } from '../Container';

export const TitleBarDivider = Container.build({
  width: 1,
  height: 20,
  background: 'border',
} satisfies ContainerSpec);
