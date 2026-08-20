import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';

export const PDFViewer = styled(Container.build({
  width: '100%',
  stackType: 'col',
  overflow: 'hidden',
} satisfies ContainerSpec))`
  flex: 1;
`;
