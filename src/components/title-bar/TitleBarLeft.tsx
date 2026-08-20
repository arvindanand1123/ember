import { Container, type ContainerSpec } from '../Container';
import { TitleBarAppHeader } from './TitleBarAppHeader';
import { TitleBarDivider } from './TitleBarDivider';
import { TitleBarNativeControlsSpacer } from './TitleBarNativeControlsSpacer';

export function TitleBarLeft() {
  return (
    <LeftCluster>
      <TitleBarNativeControlsSpacer aria-hidden="true"/>
      <TitleBarDivider aria-hidden="true"/>
      <TitleBarAppHeader/>
    </LeftCluster>
  );
}

const LeftCluster = Container.build({
  stackType: 'row',
  align: 'center',
  gap: 2,
  minWidth: 280,
} satisfies ContainerSpec);
