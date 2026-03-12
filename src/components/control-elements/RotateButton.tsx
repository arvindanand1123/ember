import { IconButton } from './IconButton';

interface RotateButtonProps {
  onRotate: () => void;
}

export function RotateButton({ onRotate }: RotateButtonProps) {
  return (
    <IconButton
      type="button"
      icon="rotateCounterClockwise"
      aria-label="Rotate document"
      onClick={onRotate}
    />
  );
}
