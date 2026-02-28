import { ControlsLeft, SecondaryButton, ZoomControls } from '../control-elements';
import { PageInfo } from './PageInfo';
import { PDFControlsContainer } from './PDFControlsContainer';

interface PDFControlsProps {
  currentPage: number;
  numPages: number;
  zoom: number;
  onBack: () => void;
  onZoomChange: (zoom: number) => void;
}

export default function PDFControls({
  currentPage,
  numPages,
  zoom,
  onBack,
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
      <ZoomControls zoom={zoom} onZoomChange={onZoomChange}/>
    </PDFControlsContainer>
  );
}
