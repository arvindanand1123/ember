import { BackButton } from './BackButton';
import { ControlsLeft } from './ControlsLeft';
import { PageInfo } from './PageInfo';
import { PDFControlsContainer } from './PDFControlsContainer';

interface PDFControlsProps {
  currentPage: number;
  numPages: number;
  onBack: () => void;
}

export default function PDFControls({
  currentPage,
  numPages,
  onBack,
}: PDFControlsProps) {
  return (
    <PDFControlsContainer>
      <ControlsLeft>
        <BackButton onClick={onBack}>
          Back
        </BackButton>
        <PageInfo>Page {currentPage} of {numPages}</PageInfo>
      </ControlsLeft>
    </PDFControlsContainer>
  );
}
