import { useCallback, useState } from 'react';

import { CommandInput, PDFViewer, TitleBar } from '../components';
import PDFControls from '../components/PDFControls';
import PDFDocument from '../components/PDFDocument';

interface PDFViewerPageProps {
  filePath: string;
  onBack: () => void;
}

export default function PDFViewerPage({ filePath, onBack }: PDFViewerPageProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, [setNumPages]);

  return (
    <PDFViewer>
      <TitleBar filePath={filePath}/>
      <PDFControls
        currentPage={currentPage}
        numPages={numPages}
        zoom={zoom}
        onBack={onBack}
        onZoomChange={setZoom}
      />
      <PDFDocument
        filePath={filePath}
        zoom={zoom}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        onPageChange={setCurrentPage}
      />
      <CommandInput/>
    </PDFViewer>
  );
}
