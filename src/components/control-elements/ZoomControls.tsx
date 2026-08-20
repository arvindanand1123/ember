import { useStable } from '../../hooks/useStable';
import { IconButton } from './IconButton';
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
  const handleZoomOut = useStable(() => {
    const newZoom = Math.max(MIN_ZOOM, zoom - ZOOM_STEP);
    onZoomChange(newZoom);
  });

  const handleZoomIn = useStable(() => {
    const newZoom = Math.min(MAX_ZOOM, zoom + ZOOM_STEP);
    onZoomChange(newZoom);
  });

  return (
    <ZoomContainer>
      <IconButton
        icon="minus"
        onClick={handleZoomOut}
        disabled={zoom <= MIN_ZOOM}
        aria-label="Zoom out"
      />
      <ZoomPercentage>{zoom}%</ZoomPercentage>
      <IconButton
        icon="plus"
        onClick={handleZoomIn}
        disabled={zoom >= MAX_ZOOM}
        aria-label="Zoom in"
      />
    </ZoomContainer>
  );
}
