import { BackButton, ControlsLeft, PageInfo, PDFControlsContainer } from './styles';

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
