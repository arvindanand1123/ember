import { usePdf } from '../hooks/usePdf';
import { PDFDocumentContainer } from './PDFDocumentContainer';
import { PDFPage } from './PDFPage';
import { PDFPageNumber } from './PDFPageNumber';

interface PDFDocumentProps {
  filePath: string;
  zoom: number;
  onDocumentLoadSuccess: (info: { numPages: number }) => void;
  onPageChange: (page: number) => void;
}

export default function PDFDocument({
  filePath,
  zoom,
  onDocumentLoadSuccess,
  onPageChange,
}: PDFDocumentProps) {
  const { containerRef, pdfData, loading, error } = usePdf({
    filePath,
    zoom,
    onDocumentLoadSuccess,
    onPageChange,
  });

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  if (loading || !pdfData) {
    return <div style={{ padding: '20px' }}>Loading document...</div>;
  }

  return (
    <PDFDocumentContainer ref={containerRef}>
      {pdfData.pages.map((page) => (
        <PDFPage
          key={page.index}
          data-page={page.index}
          $width={page.width}
          $height={page.height}
        >
          <img src={page.imageData} alt={`Page ${page.index + 1}`}/>
          <PDFPageNumber>{page.index + 1}</PDFPageNumber>
        </PDFPage>
      ))}
    </PDFDocumentContainer>
  );
}
