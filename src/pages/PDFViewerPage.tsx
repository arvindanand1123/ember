import { useCallback, useState } from 'react';

import { CommandInput, PDFViewer } from '../components';
import PDFControls from '../components/PDFControls';
import PDFDocumentViewer from '../components/PDFDocument';

interface PDFViewerPageProps {
  filePath: string;
  onBack: () => void;
}

export default function PDFViewerPage({ filePath, onBack }: PDFViewerPageProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, [setNumPages]);

  return (
    <PDFViewer>
      <PDFControls
        currentPage={currentPage}
        numPages={numPages}
        onBack={onBack}
      />
      <PDFDocumentViewer
        filePath={filePath}
        numPages={numPages}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        onPageChange={setCurrentPage}
      />
      <CommandInput/>
    </PDFViewer>
  );
}
