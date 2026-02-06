import { BackButton } from './BackButton';
import { ControlsLeft } from './ControlsLeft';
import { PageInfo } from './PageInfo';
import { PDFControlsContainer } from './PDFControlsContainer';
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
        <BackButton onClick={onBack}>
          Back
        </BackButton>
        <PageInfo>Page {currentPage} of {numPages}</PageInfo>
      </ControlsLeft>
      <ZoomControls zoom={zoom} onZoomChange={onZoomChange}/>
    </PDFControlsContainer>
  );
}
