import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { usePageNumber } from '../utils/page';

interface PDFDocumentViewerProps {
  pdfUrl: string;
  numPages: number;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onPageChange: (page: number) => void;
}

export default function PDFDocumentViewer({
  pdfUrl,
  numPages,
  onDocumentLoadSuccess,
  onPageChange,
}: PDFDocumentViewerProps) {

  const { containerRef, getCurrentPage } = usePageNumber();

  return (
    <div className="pdf-document" ref={containerRef} onScroll={() => onPageChange(getCurrentPage())}>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={true}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}
