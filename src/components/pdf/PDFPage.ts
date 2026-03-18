import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';

const isQuarterTurn = (rotation: number) => rotation % 180 !== 0;

const pdfPageSpec = {
  stackType: 'row',
  align: 'center',
  justify: 'center',
  position: 'relative',
  surface: 'surface',
  radius: 'sm',
  shadow: 'lg',
  overflow: 'hidden',
  width: 0,
  height: 0,
} satisfies ContainerSpec;

const pdfPageFrameSpec = {
  stackType: 'row',
  align: 'center',
  justify: 'center',
  width: 0,
  height: 0,
} satisfies ContainerSpec;

type PDFPageProps = {
  width: number;
  height: number;
  rotation: number;
};

export const PDFPage = Container.build(pdfPageSpec).inject<PDFPageProps>({
  width: ({ width, height, rotation }) => (isQuarterTurn(rotation) ? height : width),
  height: ({ width, height, rotation }) => (isQuarterTurn(rotation) ? width : height),
});

export const PDFPageFrame = styled(Container.build(pdfPageFrameSpec).inject<PDFPageProps>({
  width: ({ width }) => width,
  height: ({ height }) => height,
}))`
  transform: ${({ rotation }) => `rotate(${ rotation }deg)`};
  transform-origin: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;
