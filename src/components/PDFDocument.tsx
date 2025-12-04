import { useEffect, useState } from 'react';
import { PDFDocument } from './Container';
import { usePageNumber } from '../hooks/usePageNumber';
import { usePdfium } from '../hooks/usePdfium';

interface PDFDocumentViewerProps {
  filePath: string;
  numPages: number;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onPageChange: (page: number) => void;
}

export default function PDFDocumentViewer({
  filePath,
  onDocumentLoadSuccess,
  onPageChange,
}: PDFDocumentViewerProps) {
  const { containerRef, getCurrentPage } = usePageNumber();
  const { loadPdf, renderPageToBase64, loading, error } = usePdfium();
  const [renderedPages, setRenderedPages] = useState<(string | null)[]>([]);

  useEffect(() => {
    const loadAndRenderPdf = async () => {
      if (!filePath) return;

      const metadata = await loadPdf(filePath);
      if (!metadata) return;

      onDocumentLoadSuccess({ numPages: metadata.page_count });

      const pages: (string | null)[] = [];
      for (let i = 0; i < metadata.page_count; i++) {
        const base64 = await renderPageToBase64(filePath, i, 1.5);
        pages.push(base64);
      }
      setRenderedPages(pages);
    };

    loadAndRenderPdf();
  }, []);

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  if (loading && renderedPages.length === 0) {
    return <div style={{ padding: '20px' }}>Loading PDF...</div>;
  }

  return (
    <PDFDocument ref={containerRef} onScroll={() => onPageChange(getCurrentPage())}>
      <div>
        {renderedPages.map((pageBase64, index) => (
          <div key={`page_${index + 1}`} className="pdf-page">
            <img
              src={pageBase64 || ''}
              alt={`Page ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </PDFDocument>
  );
}
