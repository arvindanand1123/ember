import { Container, type ContainerSpec } from '../Container';
import { layoutSizes, semanticSpacing } from '../theme';

const commandInputContainerSpec: ContainerSpec = {
  stackType: 'row',
  position: 'fixed',
  bottom: semanticSpacing.floatingInset,
  right: semanticSpacing.floatingInset,
  surface: 'surfaceElevated',
  border: 'default',
  radius: 'lg',
  padding: semanticSpacing.inputGap,
  shadow: 'lg',
  align: 'center',
  gap: semanticSpacing.inputGap,
  minWidth: layoutSizes.floatingPanelMinWidth,
  zIndex: 'popover',
};

export const CommandInputContainer = Container.build(commandInputContainerSpec);
