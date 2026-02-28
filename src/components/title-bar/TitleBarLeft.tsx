import styled from 'styled-components';

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

const LeftCluster = styled.div`
  min-width: 280px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;
