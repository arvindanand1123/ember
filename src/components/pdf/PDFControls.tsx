import { ControlsLeft, ControlsRight, RotateButton, SecondaryButton, ZoomControls } from '../control-elements';
import { PageInfo } from './PageInfo';
import { PDFControlsContainer } from './PDFControlsContainer';

interface PDFControlsProps {
  currentPage: number;
  numPages: number;
  zoom: number;
  onBack: () => void;
  onRotate: () => void;
  onZoomChange: (zoom: number) => void;
}

export default function PDFControls({
  currentPage,
  numPages,
  zoom,
  onBack,
  onRotate,
  onZoomChange,
}: PDFControlsProps) {
  return (
    <PDFControlsContainer>
      <ControlsLeft>
        <SecondaryButton onClick={onBack}>
          Back
        </SecondaryButton>
        <PageInfo>Page {currentPage} of {numPages}</PageInfo>
      </ControlsLeft>
      <ControlsRight>
        <RotateButton onRotate={onRotate}/>
        <ZoomControls zoom={zoom} onZoomChange={onZoomChange}/>
      </ControlsRight>
    </PDFControlsContainer>
  );
}
