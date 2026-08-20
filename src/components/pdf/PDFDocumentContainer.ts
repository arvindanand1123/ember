import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';

export const PDFDocumentContainer = styled(Container.build({
  stackType: 'col',
  align: 'center',
  padding: 6,
  gap: 4,
} satisfies ContainerSpec))`
  flex: 1;
  overflow-y: auto;
`;
