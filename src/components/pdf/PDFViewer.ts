import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';

const pdfViewerSpec = {
  width: '100%',
  stackType: 'col',
  overflow: 'hidden',
} satisfies ContainerSpec;

export const PDFViewer = styled(Container.build(pdfViewerSpec))`
  flex: 1;
`;
