import styled from 'styled-components';

import flameGlyph from '../../assets/ember-flame.svg';
import { Container, type ContainerSpec } from '../Container';

export function TitleBarAppHeader() {
  return (
    <AppHeader data-nodrag>
      <AppMark alt="" src={flameGlyph} aria-hidden="true"/>
      <AppName>Ember</AppName>
    </AppHeader>
  );
}

const AppHeader = Container.build({
  stackType: 'row',
  inline: true,
  align: 'center',
  gap: 2,
  appRegion: 'no-drag',
} satisfies ContainerSpec);

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
