import { useCallback, useState } from 'react';

import { CommandInput, PDFControls, PDFDocument, PDFViewer, TitleBar } from '../components';

interface PDFViewerPageProps {
  filePath: string;
  onBack: () => void;
}

export default function PDFViewerPage({ filePath, onBack }: PDFViewerPageProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(100);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, [setNumPages]);

  const handleRotate = useCallback(() => {
    setRotation((currentRotation) => (currentRotation + 90) % 360);
  }, []);

  return (
    <PDFViewer>
      <TitleBar filePath={filePath}/>
      <PDFControls
        currentPage={currentPage}
        numPages={numPages}
        zoom={zoom}
        onBack={onBack}
        onRotate={handleRotate}
        onZoomChange={setZoom}
      />
      <PDFDocument
        filePath={filePath}
        rotation={rotation}
        zoom={zoom}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        onPageChange={setCurrentPage}
      />
      <CommandInput/>
    </PDFViewer>
  );
}
