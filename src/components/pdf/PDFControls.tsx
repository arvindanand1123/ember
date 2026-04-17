import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';
import { ControlsLeft, ControlsRight, RotateButton, SecondaryButton, ZoomControls } from '../control-elements';
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
  saveTone = 'success',
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
        {saveMessage ? <SaveFeedback $tone={saveTone}>{saveMessage}</SaveFeedback> : null}
      </ControlsLeft>
      <ControlsRight>
        <RotateButton onRotate={onRotate}/>
        <ZoomControls zoom={zoom} onZoomChange={onZoomChange}/>
      </ControlsRight>
    </PDFControlsContainer>
  );
}

interface SaveFeedbackProps {
  $tone: 'success' | 'danger';
}

const saveFeedbackSpec = {} satisfies ContainerSpec;

const SaveFeedbackBase = Container.build(saveFeedbackSpec).inject<SaveFeedbackProps>({});

const SaveFeedback = styled(SaveFeedbackBase).attrs({
  as: 'span',
})<SaveFeedbackProps>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $tone }) => (
    $tone === 'danger' ? theme.colors.dangerText : theme.colors.successText
  )};
`;
