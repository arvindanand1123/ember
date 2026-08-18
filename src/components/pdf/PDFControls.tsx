
import { Container } from '../Container';
import { ControlsLeft, ControlsRight, RotateButton, SecondaryButton, ZoomControls } from '../control-elements';
import { theme } from '../theme';
import { PageInfo } from './PageInfo';
import { PDFControlsContainer } from './PDFControlsContainer';

interface PDFControlsProps {
  currentPage: number;
  numPages: number;
  zoom: number;
  saveMessage?: string;
  saveTone?: 'success' | 'danger';
  onBack: () => void;
  onRotate: () => void;
  onZoomChange: (zoom: number) => void;
}

export default function PDFControls({
  currentPage,
  numPages,
  zoom,
  saveMessage,
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
        {saveMessage ? <SaveFeedback>{saveMessage}</SaveFeedback> : null}
      </ControlsLeft>
      <ControlsRight>
        <RotateButton onRotate={onRotate}/>
        <ZoomControls zoom={zoom} onZoomChange={onZoomChange}/>
      </ControlsRight>
    </PDFControlsContainer>
  );
}

const SaveFeedback = Container.build({ fontSize: theme.fontSizes.sm });
