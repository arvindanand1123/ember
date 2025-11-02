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
    <div className="pdf-controls">
      <div className="controls-left">
        <button onClick={onBack} className="back-button">
          Back
        </button>
        <span className="page-info">Page {currentPage} of {numPages}</span>
      </div>
    </div>
  );
}
