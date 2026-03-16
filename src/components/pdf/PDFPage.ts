import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';

const isQuarterTurn = (rotation: number) => rotation % 180 !== 0;

const pdfPageSpec: ContainerSpec = {
  stackType: 'row',
  align: 'center',
  justify: 'center',
  position: 'relative',
  surface: 'surface',
  radius: 'sm',
  shadow: 'lg',
  overflow: 'hidden',
};

const PDFPageBase = Container.build(pdfPageSpec);

export const PDFPage = styled(PDFPageBase)<{ $width: number; $height: number; $rotation: number }>`
  width: ${({ $width, $height, $rotation }) => (isQuarterTurn($rotation) ? $height : $width)}px;
  height: ${({ $width, $height, $rotation }) => (isQuarterTurn($rotation) ? $width : $height)}px;

  .pdf-page-frame {
    width: ${({ $width }) => $width}px;
    height: ${({ $height }) => $height}px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: ${({ $rotation }) => `rotate(${ $rotation }deg)`};
    transform-origin: center;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;
