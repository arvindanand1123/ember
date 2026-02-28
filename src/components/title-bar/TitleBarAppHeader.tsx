import styled from 'styled-components';

import flameGlyph from '../../assets/ember-flame.svg';

export function TitleBarAppHeader() {
  return (
    <AppHeader data-nodrag>
      <AppMark alt="" src={flameGlyph} aria-hidden="true"/>
      <AppName>Ember</AppName>
    </AppHeader>
  );
}

const AppHeader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  -webkit-app-region: no-drag;
`;

const AppMark = styled.img`
  width: 16px;
  height: 16px;
  display: block;
`;

const AppName = styled.span`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;
