import { useEffect, useRef, useState } from 'react';

import { PageData, usePdf } from '../hooks/usePdf';
import { PDFDocumentContainer } from './PDFDocumentContainer';
import { PDFPage } from './PDFPage';
import { PDFPageNumber } from './PDFPageNumber';

interface PDFDocumentProps {
  filePath: string;
  zoom: number;
  onDocumentLoadSuccess: (info: { numPages: number }) => void;
  onPageChange: (page: number) => void;
}

interface PdfData {
  pageCount: number;
  title?: string;
  author?: string;
  pages: PageData[];
}

export default function PDFDocument({
  filePath,
  zoom,
  onDocumentLoadSuccess,
  onPageChange,
}: PDFDocumentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfData, setPdfData] = useState<PdfData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPageNumbers, getRenderedPages } = usePdf();

  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true);
      setError(null);

      try {
        const pageNumbers = await getPageNumbers(filePath);
        onDocumentLoadSuccess({ numPages: pageNumbers.length });
        const pages = await getRenderedPages(filePath, pageNumbers, zoom);

        setPdfData({
          pageCount: pageNumbers.length,
          pages,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [filePath, zoom, onDocumentLoadSuccess, getPageNumbers, getRenderedPages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pdfData) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let currentPage = 1;
      const pageElements = container.querySelectorAll('[data-page]');

      pageElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= containerCenter) {
          currentPage = parseInt(el.getAttribute('data-page') || '0', 10) + 1;
        }
      });

      onPageChange(currentPage);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [pdfData, onPageChange]);

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
