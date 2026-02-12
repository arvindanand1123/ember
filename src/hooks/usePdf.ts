import { useEffect, useRef, useState } from 'react';

import { useInternalDriver } from './useInternalDriver';
import { useStable } from './useStable';

export interface PageData {
  index: number;
  width: number;
  height: number;
  imageData: string;
}

export interface DocumentData {
  pageCount: number;
  title?: string;
  author?: string;
  pages: PageData[];
}

interface UsePdfOptions {
  filePath: string;
  zoom: number;
  onDocumentLoadSuccess: (info: { numPages: number }) => void;
  onPageChange: (page: number) => void;
}

interface RenderDocumentOptions {
  filePath: string;
  zoom: number;
  loadPdf: (filePath: string) => Promise<{
    page_count: number;
    title?: string;
    author?: string;
  }>;
  getPageInfo: (filePath: string, pageIndex: number) => Promise<{
    page_index: number;
    width: number;
    height: number;
  }>;
  renderPageToBase64: (filePath: string, pageIndex: number, scale: number) => Promise<string>;
}

async function getRenderedDocument({
  filePath,
  zoom,
  loadPdf,
  getPageInfo,
  renderPageToBase64,
}: RenderDocumentOptions): Promise<DocumentData> {
  const metadata = await loadPdf(filePath);
  const pageNumbers = Array.from({ length: metadata.page_count }, (_, i) => i);
  const scale = zoom / 100;

  const pages: PageData[] = await Promise.all(pageNumbers.map(async (pageNumber) => {
    const pageInfo = await getPageInfo(filePath, pageNumber);
    const imageData = await renderPageToBase64(filePath, pageNumber, scale);
    return {
      index: pageNumber,
      width: pageInfo.width * scale,
      height: pageInfo.height * scale,
      imageData,
    };
  }));

  return {
    pageCount: pageNumbers.length,
    title: metadata.title,
    author: metadata.author,
    pages,
  };
}

function getCurrentPage(container: HTMLDivElement): number {
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

  return currentPage;
}

export function usePdf({
  filePath,
  zoom,
  onDocumentLoadSuccess,
  onPageChange,
}: UsePdfOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfData, setPdfData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stableOnDocumentLoadSuccess = useStable(onDocumentLoadSuccess);
  const stableOnPageChange = useStable(onPageChange);
  const { loadPdf, getPageInfo, renderPageToBase64 } = useInternalDriver();
  const latestLoadIdRef = useRef(0);

  useEffect(() => {
    const loadId = latestLoadIdRef.current + 1;
    latestLoadIdRef.current = loadId;
    const isLatestLoad = () => latestLoadIdRef.current === loadId;

    const loadDocument = async () => {
      setLoading(true);
      setError(null);

      try {
        const renderedDocument = await getRenderedDocument({
          filePath,
          zoom,
          loadPdf,
          getPageInfo,
          renderPageToBase64,
        });
        if (!isLatestLoad()) return;

        stableOnDocumentLoadSuccess({ numPages: renderedDocument.pageCount });
        setPdfData(renderedDocument);
      } catch (err) {
        if (!isLatestLoad()) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (isLatestLoad()) setLoading(false);
      }
    };

    loadDocument();

    return () => {
      if (isLatestLoad()) {
        latestLoadIdRef.current += 1;
      }
    };
  }, [filePath, zoom, stableOnDocumentLoadSuccess, loadPdf, getPageInfo, renderPageToBase64]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pdfData) return;

    const handleScroll = () => {
      stableOnPageChange(getCurrentPage(container));
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, [pdfData, stableOnPageChange]);

  return {
    containerRef,
    pdfData,
    loading,
    error,
  };
}
