import { useCallback, useEffect, useRef, useState } from 'react';

import {
  profiling,
  resetProfilingEvents,
} from '../profiling/profiling';
import { useInternalDriver } from './useInternalDriver';
import { useStable } from './useStable';

export interface PageData {
  index: number;
  width: number;
  height: number;
  imageUrl: string;
}

interface RenderedPageData {
  index: number;
  width: number;
  height: number;
  imageBytes: Uint8Array;
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

function createPageImageUrl(pngBytes: Uint8Array) {
  return URL.createObjectURL(new Blob([pngBytes], { type: 'image/png' }));
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
  const activeLoadIdRef = useRef(0);
  const [pdfData, setPdfData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stableOnDocumentLoadSuccess = useStable(onDocumentLoadSuccess);
  const stableOnPageChange = useStable(onPageChange);
  const { loadPdf, getPageInfo, renderPage } = useInternalDriver();

  const getRenderedDocument = useCallback(
    async (pdfFilePath: string, pdfZoom: number, loadId: number): Promise<DocumentData> => {
      const metadata = await loadPdf(pdfFilePath);
      const pageNumbers = Array.from({ length: metadata.page_count }, (_, i) => i);
      const scale = pdfZoom / 100;
      const trace = profiling.scoped(() => activeLoadIdRef.current === loadId);

      await trace.startTrace({
        name: 'getRenderedDocument:renderLoop',
        details: {
          filePath: pdfFilePath,
          zoom: pdfZoom,
          pageCount: pageNumbers.length,
        },
      });

      const renderedPages = await Promise.all(pageNumbers.map(async (pageNumber): Promise<RenderedPageData> => {
        await trace.startTrace({
          name: `getPageInfo:page:${pageNumber + 1}`,
          details: {
            filePath: pdfFilePath,
            zoom: pdfZoom,
            page: pageNumber + 1,
          },
        });
        const pageInfo = await getPageInfo(pdfFilePath, pageNumber);
        await trace.endTrace({
          name: `getPageInfo:page:${pageNumber + 1}`,
          details: {
            page: pageNumber + 1,
            width: pageInfo.width,
            height: pageInfo.height,
          },
        });

        await trace.startTrace({
          name: `renderPage:page:${pageNumber + 1}`,
          details: {
            filePath: pdfFilePath,
            zoom: pdfZoom,
            page: pageNumber + 1,
            scale,
          },
        });
        const imageBytes = await renderPage(pdfFilePath, pageNumber, scale);
        await trace.endTrace({
          name: `renderPage:page:${pageNumber + 1}`,
          details: {
            page: pageNumber + 1,
            imageBytesLength: imageBytes.length,
          },
        });

        return {
          index: pageNumber,
          width: pageInfo.width * scale,
          height: pageInfo.height * scale,
          imageBytes,
        };
      }));

      await trace.endTrace({
        name: 'getRenderedDocument:renderLoop',
        details: {
          filePath: pdfFilePath,
          zoom: pdfZoom,
          pageCount: pageNumbers.length,
        },
      });

      const pages = renderedPages.map(({ imageBytes, ...page }) => ({
        ...page,
        imageUrl: createPageImageUrl(imageBytes),
      }));

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
      const loadId = activeLoadIdRef.current + 1;
      activeLoadIdRef.current = loadId;

      setLoading(true);
      setError(null);
      setPdfData(null);
      await resetProfilingEvents();

      try {
        const renderedDocument = await getRenderedDocument(filePath, zoom, loadId);
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
