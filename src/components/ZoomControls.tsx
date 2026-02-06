import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';

import { ZoomButton } from './ZoomButton';
import { ZoomContainer } from './ZoomContainer';
import { ZoomPercentage } from './ZoomPercentage';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const MIN_ZOOM = 25;
const MAX_ZOOM = 300;
const ZOOM_STEP = 25;

export function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(MIN_ZOOM, zoom - ZOOM_STEP);
    onZoomChange(newZoom);
  }, [zoom, onZoomChange]);

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(MAX_ZOOM, zoom + ZOOM_STEP);
    onZoomChange(newZoom);
  }, [zoom, onZoomChange]);

  return (
    <ZoomContainer>
      <ZoomButton
        onClick={handleZoomOut}
        disabled={zoom <= MIN_ZOOM}
        aria-label="Zoom out"
      >
        <MinusIcon/>
      </ZoomButton>
      <ZoomPercentage>{zoom}%</ZoomPercentage>
      <ZoomButton
        onClick={handleZoomIn}
        disabled={zoom >= MAX_ZOOM}
        aria-label="Zoom in"
      >
        <PlusIcon/>
      </ZoomButton>
    </ZoomContainer>
  );
}
