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
  width: ${({ theme }) => theme.iconSizes.md};
  height: ${({ theme }) => theme.iconSizes.md};
  display: block;
`;

const AppName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;
