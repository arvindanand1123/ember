import { useCallback, useEffect, useRef, useState } from 'react';

import { useInternalDriver } from './useInternalDriver';
import { useStable } from './useStable';

export interface PageData {
  index: number;
  width: number;
  height: number;
  imageUrl: string;
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

type RenderedPageBytes = ArrayBuffer | Uint8Array | number[];

function toByteArray(pngBytes: RenderedPageBytes) {
  if (pngBytes instanceof ArrayBuffer) {
    return new Uint8Array(pngBytes);
  }

  return pngBytes instanceof Uint8Array ? pngBytes : Uint8Array.from(pngBytes);
}

function createPageImageUrl(pngBytes: RenderedPageBytes) {
  const byteArray = toByteArray(pngBytes);
  return URL.createObjectURL(new Blob([byteArray], { type: 'image/png' }));
}

function revokeDocumentUrls(documentData: DocumentData | null) {
  if (!documentData) {
    return;
  }

  documentData.pages.forEach((page) => {
    URL.revokeObjectURL(page.imageUrl);
  });
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
  const { loadPdf, getPageInfo, renderPage } = useInternalDriver();

  const getRenderedDocument = useCallback(
    async (pdfFilePath: string, pdfZoom: number): Promise<DocumentData> => {
      const metadata = await loadPdf(pdfFilePath);
      const pageNumbers = Array.from({ length: metadata.page_count }, (_, i) => i);
      const scale = pdfZoom / 100;

      const pageResults = await Promise.allSettled(pageNumbers.map(async (pageNumber) => {
        const pageInfo = await getPageInfo(pdfFilePath, pageNumber);
        const imageBytes = await renderPage(pdfFilePath, pageNumber, scale);
        return {
          index: pageNumber,
          width: pageInfo.width * scale,
          height: pageInfo.height * scale,
          imageUrl: createPageImageUrl(imageBytes),
        };
      }));

      const failedRender = pageResults.find(
        (result): result is PromiseRejectedResult => result.status === 'rejected',
      );

      if (failedRender) {
        pageResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            URL.revokeObjectURL(result.value.imageUrl);
          }
        });
        throw failedRender.reason;
      }

      const pages = pageResults.map((result) => {
        if (result.status !== 'fulfilled') {
          throw new Error('Page rendering did not complete');
        }
        return result.value;
      });

      return {
        pageCount: pageNumbers.length,
        title: metadata.title,
        author: metadata.author,
        pages,
      };
    },
    [getPageInfo, loadPdf, renderPage],
  );

  useEffect(() => {
    let isStale = false;

    const loadDocument = async () => {
      setLoading(true);
      setError(null);
      setPdfData(null);

      try {
        const renderedDocument = await getRenderedDocument(filePath, zoom);
        if (isStale) {
          revokeDocumentUrls(renderedDocument);
          return;
        }

        stableOnDocumentLoadSuccess({ numPages: renderedDocument.pageCount });
        setPdfData(renderedDocument);
      } catch (err) {
        if (!isStale) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!isStale) {
          setLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      isStale = true;
    };
  }, [filePath, zoom, stableOnDocumentLoadSuccess, getRenderedDocument]);

  useEffect(() => {
    if (!pdfData) {
      return;
    }

    return () => {
      revokeDocumentUrls(pdfData);
    };
  }, [pdfData]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pdfData) return;

    const getCurrentPage = () => {
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
    };

    const handleScroll = () => {
      stableOnPageChange(getCurrentPage());
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
