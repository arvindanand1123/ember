import { ControlsLeft } from './ControlsLeft';
import { PageInfo } from './PageInfo';
import { PDFControlsContainer } from './PDFControlsContainer';
import { SecondaryButton } from './SecondaryButton';
import { ZoomControls } from './ZoomControls';

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
