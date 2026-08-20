import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';

const isQuarterTurn = (rotation: number) => rotation % 180 !== 0;

type PDFPageProps = {
  width: number;
  height: number;
  rotation: number;
};

export const PDFPage = styled(Container.build({
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
} satisfies ContainerSpec).inject<PDFPageProps>({
  width: ({ width, height, rotation }) => (isQuarterTurn(rotation) ? height : width),
  height: ({ width, height, rotation }) => (isQuarterTurn(rotation) ? width : height),
}))`
  flex-shrink: 0;
`;

export const PDFPageFrame = styled(Container.build({
  stackType: 'row',
  align: 'center',
  justify: 'center',
  width: 0,
  height: 0,
} satisfies ContainerSpec).inject<PDFPageProps>({
  width: ({ width }) => width,
  height: ({ height }) => height,
}))`
  transform: ${({ rotation }) => `rotate(${ rotation }deg)`};
  transform-origin: center;

  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;
