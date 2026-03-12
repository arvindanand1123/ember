import styled from 'styled-components';

const isQuarterTurn = (rotation: number) => rotation % 180 !== 0;

export const PDFPage = styled.div<{ $width: number; $height: number; $rotation: number }>`
  width: ${({ $width, $height, $rotation }) => (isQuarterTurn($rotation) ? $height : $width)}px;
  height: ${({ $width, $height, $rotation }) => (isQuarterTurn($rotation) ? $width : $height)}px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;

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
