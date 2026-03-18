import { usePdf } from '../../hooks/usePdf';
import { PDFDocumentContainer } from './PDFDocumentContainer';
import { PDFPage, PDFPageFrame } from './PDFPage';
import { PDFPageNumber } from './PDFPageNumber';

interface PDFDocumentProps {
  filePath: string;
  rotation: number;
  zoom: number;
  onDocumentLoadSuccess: (info: { numPages: number }) => void;
  onPageChange: (page: number) => void;
}

export default function PDFDocument({
  filePath,
  rotation,
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
          width={page.width}
          height={page.height}
          rotation={rotation}
        >
          <PDFPageFrame
            width={page.width}
            height={page.height}
            rotation={rotation}
            data-rotation={rotation}
          >
            <img src={page.imageUrl} alt={`Page ${page.index + 1}`}/>
          </PDFPageFrame>
          <PDFPageNumber>{page.index + 1}</PDFPageNumber>
        </PDFPage>
      ))}
    </PDFDocumentContainer>
  );
}
