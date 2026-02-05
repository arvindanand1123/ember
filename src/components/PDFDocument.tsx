import { useEffect, useRef, useState } from 'react';

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

interface PageData {
  index: number;
  width: number;
  height: number;
  imageData: string;
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
  const scale = zoom / 100;
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfData, setPdfData] = useState<PdfData | null>(null);
  const { loadPdf, getPageInfo, renderPageToBase64, loading, error } = usePdf();

  useEffect(() => {
    const loadDocument = async () => {
      const metadata = await loadPdf(filePath);
      if (!metadata) return;

      onDocumentLoadSuccess({ numPages: metadata.page_count });

      const pages: PageData[] = [];

      for (let i = 0; i < metadata.page_count; i++) {
        const pageInfo = await getPageInfo(filePath, i);
        if (!pageInfo) continue;

        const imageData = await renderPageToBase64(filePath, i, scale);
        if (!imageData) continue;

        pages.push({
          index: i,
          width: pageInfo.width * scale,
          height: pageInfo.height * scale,
          imageData,
        });
      }

      setPdfData({
        pageCount: metadata.page_count,
        title: metadata.title,
        author: metadata.author,
        pages,
      });
    };

    loadDocument();
  }, [filePath, scale, onDocumentLoadSuccess, loadPdf, getPageInfo, renderPageToBase64]);

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
